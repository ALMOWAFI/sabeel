#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
Scholarly Books Collection for Sabeel Islamic AI
===============================================

This script collects Islamic scholarly texts from specified scholars:
- Abu Hamid Al-Ghazali
- Muhammad Al-Ghazali
- Sheikh Ahmad Al-Sayed
- Jihad al-Turbani
- Ibrahim al-Sakran

It uses multiple sources including:
- Al-Maktaba Al-Shamela (المكتبة الشاملة)
- Dorar.net (موقع الدرر السنية)
- Al-Waraq (الوراق)
- Other online repositories
"""

import os
import json
import logging
import re
import time
import requests
from bs4 import BeautifulSoup
from typing import List, Dict, Any, Tuple, Optional
import csv
from dataclasses import dataclass
from pathlib import Path

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger("sabeel-scholarly-collector")

@dataclass
class ScholarlyBook:
    """Class for representing a scholarly text."""
    title: str
    author: str
    period: str  # 'classical' or 'contemporary'
    category: str  # e.g., 'fiqh', 'aqeedah', 'tafsir'
    source: str  # e.g., 'shamela', 'dorar', 'manual'
    text_content: str
    source_id: str = None  # ID in the original source system
    filename: str = None  # Local filename if saved
    language: str = "arabic"
    processed: bool = False
    metadata: Dict = None

class ScholarsCollector:
    """Collector for Islamic scholarly texts."""
    
    def __init__(self, output_dir: str = "scholarly_texts"):
        """Initialize the collector."""
        self.output_dir = output_dir
        self.base_path = Path(output_dir)
        self.base_path.mkdir(parents=True, exist_ok=True)
        
        # Create directories for each scholar
        self.scholars = [
            "Abu Hamid Al-Ghazali",
            "Muhammad Al-Ghazali",
            "Sheikh Ahmad Al-Sayed",
            "Jihad al-Turbani",
            "Ibrahim al-Sakran"
        ]
        
        for scholar in self.scholars:
            scholar_dir = self.base_path / self._sanitize_filename(scholar)
            scholar_dir.mkdir(exist_ok=True)
        
        # Map of scholars to their books with source IDs/URLs
        self.scholar_books = self._initialize_scholar_books()
        
        logger.info(f"Initialized collector with output directory: {output_dir}")
    
    def _sanitize_filename(self, name: str) -> str:
        """Convert a name to a valid filename."""
        return re.sub(r'[^\w\s-]', '', name).strip().replace(' ', '_')
    
    def _initialize_scholar_books(self) -> Dict:
        """Initialize the mapping of scholars to their books."""
        return {
            "Abu Hamid Al-Ghazali": [
                {"title": "إحياء علوم الدين", "source": "shamela", "id": "1741", "category": "spirituality"},
                {"title": "المستصفى", "source": "shamela", "id": "1925", "category": "usul_fiqh"},
                {"title": "المنقذ من الضلال", "source": "shamela", "id": "1338", "category": "autobiography"},
                {"title": "تهافت الفلاسفة", "source": "shamela", "id": "5614", "category": "philosophy"},
                {"title": "بداية الهداية", "source": "shamela", "id": "5757", "category": "spirituality"}
            ],
            "Muhammad Al-Ghazali": [
                {"title": "فقه السيرة", "source": "shamela", "id": "1128", "category": "seerah"},
                {"title": "خلق المسلم", "source": "shamela", "id": "5697", "category": "ethics"},
                {"title": "كيف نفهم الإسلام", "source": "dorar", "url": "example_url_1", "category": "islamic_thought"},
                {"title": "هموم داعية", "source": "dorar", "url": "example_url_2", "category": "dawah"},
                {"title": "من هنا نعلم", "source": "manual", "path": "manual_texts/muhammad_alghazali/min_huna_nalam.txt", "category": "education"}
            ],
            "Sheikh Ahmad Al-Sayed": [
                {"title": "المنهج القرآني للدعوة", "source": "manual", "path": "manual_texts/ahmad_alsayed/manhaj_qurani.txt", "category": "dawah"},
                {"title": "فقه الأسرة", "source": "manual", "path": "manual_texts/ahmad_alsayed/fiqh_usra.txt", "category": "family_fiqh"}
                # Add more books as they become available
            ],
            "Jihad al-Turbani": [
                {"title": "أصول التربية الإسلامية", "source": "manual", "path": "manual_texts/jihad_turbani/usul_tarbiya.txt", "category": "education"},
                {"title": "منهجية الإصلاح", "source": "manual", "path": "manual_texts/jihad_turbani/manhajiyat_islah.txt", "category": "reform"}
                # Add more books as they become available
            ],
            "Ibrahim al-Sakran": [
                {"title": "التنوير الزائف", "source": "manual", "path": "manual_texts/ibrahim_sakran/tanweer_zaef.txt", "category": "critique"},
                {"title": "نقد العلمانية", "source": "dorar", "url": "example_url_3", "category": "critique"},
                {"title": "أسئلة العصر المحيرة", "source": "manual", "path": "manual_texts/ibrahim_sakran/asilat_asr.txt", "category": "contemporary_issues"}
            ]
        }
    
    def collect_all_books(self) -> List[ScholarlyBook]:
        """Collect all books from all scholars."""
        all_books = []
        
        for scholar, books in self.scholar_books.items():
            logger.info(f"Collecting books for scholar: {scholar}")
            
            for book_info in books:
                try:
                    book = self._collect_book(scholar, book_info)
                    if book:
                        all_books.append(book)
                        self._save_book(book)
                except Exception as e:
                    logger.error(f"Error collecting book {book_info['title']} by {scholar}: {e}")
        
        logger.info(f"Collected {len(all_books)} books in total")
        return all_books
    
    def _collect_book(self, scholar: str, book_info: Dict) -> Optional[ScholarlyBook]:
        """Collect a single book based on its source."""
        title = book_info["title"]
        source = book_info["source"]
        category = book_info.get("category", "general")
        
        logger.info(f"Collecting book: {title} by {scholar} from {source}")
        
        # Determine the period (classical or contemporary)
        period = "classical" if scholar == "Abu Hamid Al-Ghazali" else "contemporary"
        
        # Collect based on source type
        if source == "shamela":
            return self._collect_from_shamela(scholar, book_info, period, category)
        elif source == "dorar":
            return self._collect_from_dorar(scholar, book_info, period, category)
        elif source == "manual":
            return self._collect_manual_text(scholar, book_info, period, category)
        else:
            logger.warning(f"Unknown source type: {source} for book {title}")
            return None
    
    def _collect_from_shamela(self, scholar: str, book_info: Dict, period: str, category: str) -> Optional[ScholarlyBook]:
        """Collect a book from Al-Maktaba Al-Shamela."""
        book_id = book_info["id"]
        title = book_info["title"]
        
        logger.info(f"Collecting from Shamela: {title} (ID: {book_id})")
        
        # In a real implementation, this would use Shamela's API or web scraping
        # For demonstration, we'll simulate the retrieval
        
        # Simulated text content (would be retrieved from Shamela in reality)
        if title == "إحياء علوم الدين":
            text_content = """
            بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
            
            الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ حَمْدًا يُوَافِي نِعَمَهُ وَيُكَافِئُ مَزِيدَهُ...
            
            كتاب العلم: وهو الكتاب الأول من ربع العبادات من كتاب إحياء علوم الدين
            
            بيان فضل العلم والتعليم والتعلم:
            
            قال الله تعالى: {يَرْفَعِ اللَّهُ الَّذِينَ آمَنُوا مِنْكُمْ وَالَّذِينَ أُوتُوا الْعِلْمَ دَرَجَاتٍ}
            
            العلم الذي هو فرض عين هو علم المعاملة، وهو علم أحوال القلب...
            """
        else:
            # Generate placeholder content for other books
            text_content = f"محتوى كتاب {title} للإمام {scholar}.\n\nهذا نص توضيحي فقط."
        
        # Create the scholarly book object
        book = ScholarlyBook(
            title=title,
            author=scholar,
            period=period,
            category=category,
            source="shamela",
            text_content=text_content,
            source_id=book_id,
            metadata={"original_source": "Al-Maktaba Al-Shamela", "book_id": book_id}
        )
        
        return book
    
    def _collect_from_dorar(self, scholar: str, book_info: Dict, period: str, category: str) -> Optional[ScholarlyBook]:
        """Collect a book from Dorar.net."""
        url = book_info["url"]
        title = book_info["title"]
        
        logger.info(f"Collecting from Dorar: {title} (URL: {url})")
        
        # In a real implementation, this would use web scraping
        # For demonstration, we'll simulate the retrieval
        
        # Simulated text content
        text_content = f"محتوى كتاب {title} للأستاذ {scholar}.\n\nهذا نص توضيحي من موقع الدرر السنية."
        
        # Create the scholarly book object
        book = ScholarlyBook(
            title=title,
            author=scholar,
            period=period,
            category=category,
            source="dorar",
            text_content=text_content,
            source_id=url,
            metadata={"original_source": "Dorar.net", "url": url}
        )
        
        return book
    
    def _collect_manual_text(self, scholar: str, book_info: Dict, period: str, category: str) -> Optional[ScholarlyBook]:
        """Collect a book from manual sources."""
        path = book_info.get("path")
        title = book_info["title"]
        
        logger.info(f"Collecting manual text: {title} (Path: {path})")
        
        # In a real implementation, this would read from a file
        # For demonstration, we'll generate placeholder content
        
        text_content = f"محتوى كتاب {title} للشيخ {scholar}.\n\nهذا نص توضيحي للمصادر اليدوية."
        
        # Create the scholarly book object
        book = ScholarlyBook(
            title=title,
            author=scholar,
            period=period,
            category=category,
            source="manual",
            text_content=text_content,
            filename=os.path.basename(path) if path else None,
            metadata={"original_source": "Manual collection", "path": path}
        )
        
        return book
    
    def _save_book(self, book: ScholarlyBook) -> None:
        """Save a book to the appropriate directory."""
        scholar_dir = self.base_path / self._sanitize_filename(book.author)
        book_filename = self._sanitize_filename(book.title) + ".txt"
        book_path = scholar_dir / book_filename
        
        # Save the text content
        with open(book_path, 'w', encoding='utf-8') as f:
            f.write(book.text_content)
        
        # Save metadata
        metadata_path = scholar_dir / (self._sanitize_filename(book.title) + "_metadata.json")
        metadata = {
            "title": book.title,
            "author": book.author,
            "period": book.period,
            "category": book.category,
            "source": book.source,
            "source_id": book.source_id,
            "language": book.language,
            "processed": book.processed,
            "metadata": book.metadata or {},
            "collected_at": time.strftime("%Y-%m-%d %H:%M:%S")
        }
        
        with open(metadata_path, 'w', encoding='utf-8') as f:
            json.dump(metadata, f, ensure_ascii=False, indent=2)
        
        logger.info(f"Saved book: {book.title} by {book.author} to {book_path}")
    
    def create_dataset_catalog(self) -> str:
        """Create a catalog of all collected books."""
        catalog_path = self.base_path / "catalog.csv"
        
        books = []
        # Traverse the directory structure to find all books
        for scholar_dir in self.base_path.iterdir():
            if scholar_dir.is_dir() and not scholar_dir.name.startswith('.'):
                for file_path in scholar_dir.iterdir():
                    if file_path.suffix == '.txt' and not file_path.name.endswith('_metadata.txt'):
                        # Try to load metadata
                        metadata_path = file_path.parent / (file_path.stem + "_metadata.json")
                        if metadata_path.exists():
                            try:
                                with open(metadata_path, 'r', encoding='utf-8') as f:
                                    metadata = json.load(f)
                                    books.append(metadata)
                            except Exception as e:
                                logger.error(f"Error loading metadata for {file_path}: {e}")
                                # Add basic info without metadata
                                books.append({
                                    "title": file_path.stem,
                                    "author": scholar_dir.name.replace('_', ' '),
                                    "file_path": str(file_path.relative_to(self.base_path))
                                })
                        else:
                            # Add basic info without metadata
                            books.append({
                                "title": file_path.stem,
                                "author": scholar_dir.name.replace('_', ' '),
                                "file_path": str(file_path.relative_to(self.base_path))
                            })
        
        # Write catalog to CSV
        with open(catalog_path, 'w', encoding='utf-8', newline='') as f:
            if books:
                fieldnames = books[0].keys()
                writer = csv.DictWriter(f, fieldnames=fieldnames)
                writer.writeheader()
                writer.writerows(books)
        
        logger.info(f"Created catalog with {len(books)} books at {catalog_path}")
        return str(catalog_path)

def main():
    """Main function to collect scholarly books."""
    output_dir = os.path.join(
        "c:", os.sep, "Users", "Aliel", "OneDrive - Constructor University", 
        "Desktop", "sabeel", "sabeel-tech-awakening", "data", "scholarly_texts"
    )
    
    # Create the collector
    collector = ScholarsCollector(output_dir=output_dir)
    
    # Collect all books
    books = collector.collect_all_books()
    
    # Create catalog
    catalog_path = collector.create_dataset_catalog()
    
    print(f"Collected {len(books)} books from the specified scholars")
    print(f"Catalog created at: {catalog_path}")
    
    # Summarize collection
    print("\nCollection Summary:")
    scholar_counts = {}
    category_counts = {}
    
    for scholar in collector.scholars:
        scholar_counts[scholar] = len([b for b in books if b.author == scholar])
    
    for book in books:
        category_counts[book.category] = category_counts.get(book.category, 0) + 1
    
    print("\nBooks per Scholar:")
    for scholar, count in scholar_counts.items():
        print(f"  - {scholar}: {count} books")
    
    print("\nBooks per Category:")
    for category, count in category_counts.items():
        print(f"  - {category}: {count} books")

if __name__ == "__main__":
    main()
