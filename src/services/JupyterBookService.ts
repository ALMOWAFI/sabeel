// JupyterBookService.ts
// Service for fetching Jupyter Book data (real API or mock fallback)

const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true';
const API_BASE_URL = import.meta.env.VITE_JUPYTER_API_URL || '/api/jupyter';

export interface BookContent {
  title: string;
  author: string;
  chapters: { title: string; sections: string[] }[];
}

export interface PageContentItem {
  type: string;
  content?: string;
  items?: string[];
  language?: string;
}

export class JupyterBookService {
  async getBookContent(): Promise<BookContent> {
    if (USE_MOCK_DATA) return this.getMockBookContent();
    try {
      const res = await fetch(`${API_BASE_URL}/book`, { credentials: 'include' });
      if (!res.ok) throw new Error('API error');
      return await res.json();
    } catch (e) {
      return this.getMockBookContent();
    }
  }

  async getPageContent(page: number): Promise<PageContentItem[]> {
    if (USE_MOCK_DATA) return this.getMockPageContent(page);
    try {
      const res = await fetch(`${API_BASE_URL}/page/${page}`, { credentials: 'include' });
      if (!res.ok) throw new Error('API error');
      return await res.json();
    } catch (e) {
      return this.getMockPageContent(page);
    }
  }

  // --- Mock Data ---
  private getMockBookContent(): BookContent {
    return {
      title: "أساسيات علوم الحديث",
      author: "د. عبدالله الأنصاري",
      chapters: [
        { title: "مقدمة في علوم الحديث", sections: ["تعريف علم الحديث", "أهمية علم الحديث", "نشأة علم الحديث"] },
        { title: "أقسام الحديث", sections: ["الحديث الصحيح", "الحديث الحسن", "الحديث الضعيف"] },
        { title: "رواة الحديث", sections: ["طبقات الرواة", "الجرح والتعديل", "كتب الرجال"] },
        { title: "تخريج الحديث", sections: ["طرق التخريج", "كتب التخريج", "أمثلة تطبيقية"] }
      ]
    };
  }

  private getMockPageContent(page: number): PageContentItem[] {
    // For simplicity, return the same mock content for all pages
    return [
      { type: 'heading', content: 'تعريف علم الحديث' },
      { type: 'text', content: 'علم الحديث هو العلم الذي يبحث في نقل أقوال النبي صلى الله عليه وسلم وأفعاله وتقريراته وصفاته، ويهتم بضبط ألفاظها وتمييز صحيحها من سقيمها.' },
      { type: 'text', content: 'ينقسم علم الحديث إلى قسمين رئيسيين:' },
      { type: 'list', items: [
        'علم الحديث رواية: ويختص بنقل أقوال النبي صلى الله عليه وسلم وأفعاله وتقريراته وصفاته.',
        'علم الحديث دراية: ويختص بمعرفة القواعد التي يعرف بها حال الراوي والمروي من حيث القبول والرد.'
      ] },
      { type: 'heading', content: 'نشأة علم الحديث' },
      { type: 'text', content: 'بدأ الاهتمام بعلم الحديث منذ عهد الصحابة رضوان الله عليهم، حيث كانوا يتثبتون في نقل الحديث ويتحرون الدقة في روايته.' },
      { type: 'code', language: 'python', content: `# مثال على استخدام مكتبة لتحليل سند الحديث\nimport hadith_analyzer\n\n# تحليل سند حديث\nhadith = "حدثنا عبد الله بن يوسف قال أخبرنا مالك عن نافع عن عبد الله بن عمر رضي الله عنهما"\nchain = hadith_analyzer.extract_narrators(hadith)\nprint(chain)\n\n# تقييم الإسناد\nrating = hadith_analyzer.evaluate_chain(chain)\nprint(f"تقييم الإسناد: {rating}")` },
      { type: 'text', content: 'ثم تطور هذا العلم في عصر التابعين وتابعي التابعين، حتى أصبح علماً مستقلاً له قواعده وأصوله.' }
    ];
  }
}

export const jupyterBookService = new JupyterBookService(); 