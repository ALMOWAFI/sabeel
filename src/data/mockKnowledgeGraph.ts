// Mock data for Islamic Knowledge Graph visualization

export interface KnowledgeNode {
  id: string;
  name: string;
  group: string;
  level: number;
  description?: string;
  scholars?: string[];
  books?: string[];
  era?: string;
  val?: number; // Size value for visualization
}

export interface KnowledgeLink {
  source: string;
  target: string;
  value: number;
  type?: string;
  description?: string;
}

export interface KnowledgeGraph {
  nodes: KnowledgeNode[];
  links: KnowledgeLink[];
}

export const mockKnowledgeGraph: KnowledgeGraph = {
  nodes: [
    // Core Islamic concepts (Level 1)
    { id: "islam", name: "الإسلام", group: "core", level: 1, val: 30, description: "الدين الإسلامي" },
    
    // Main categories (Level 2)
    { id: "quran", name: "القرآن الكريم", group: "primary", level: 2, val: 25, description: "كتاب الله المنزل على محمد صلى الله عليه وسلم" },
    { id: "hadith", name: "الحديث الشريف", group: "primary", level: 2, val: 25, description: "أقوال وأفعال النبي محمد صلى الله عليه وسلم" },
    { id: "fiqh", name: "الفقه", group: "primary", level: 2, val: 25, description: "علم الأحكام الشرعية العملية المستنبطة من أدلتها التفصيلية" },
    { id: "aqeedah", name: "العقيدة", group: "primary", level: 2, val: 25, description: "علم أصول الإيمان والتوحيد" },
    { id: "tafsir", name: "التفسير", group: "primary", level: 2, val: 25, description: "علم شرح وتوضيح معاني القرآن الكريم" },
    
    // Subcategories (Level 3)
    // Fiqh schools
    { id: "hanafi", name: "المذهب الحنفي", group: "madhab", level: 3, val: 15, description: "مذهب فقهي نسبة إلى الإمام أبو حنيفة النعمان", scholars: ["أبو حنيفة النعمان", "أبو يوسف", "محمد بن الحسن الشيباني"], era: "80-150 هـ" },
    { id: "maliki", name: "المذهب المالكي", group: "madhab", level: 3, val: 15, description: "مذهب فقهي نسبة إلى الإمام مالك بن أنس", scholars: ["مالك بن أنس", "ابن القاسم", "سحنون"], era: "93-179 هـ" },
    { id: "shafii", name: "المذهب الشافعي", group: "madhab", level: 3, val: 15, description: "مذهب فقهي نسبة إلى الإمام محمد بن إدريس الشافعي", scholars: ["محمد بن إدريس الشافعي", "المزني", "البويطي"], era: "150-204 هـ" },
    { id: "hanbali", name: "المذهب الحنبلي", group: "madhab", level: 3, val: 15, description: "مذهب فقهي نسبة إلى الإمام أحمد بن حنبل", scholars: ["أحمد بن حنبل", "ابن قدامة", "ابن تيمية"], era: "164-241 هـ" },
    
    // Hadith collections
    { id: "bukhari", name: "صحيح البخاري", group: "hadith_collection", level: 3, val: 15, description: "أصح كتب الحديث، جمعه الإمام محمد بن إسماعيل البخاري", scholars: ["محمد بن إسماعيل البخاري"], books: ["الجامع المسند الصحيح المختصر من أمور رسول الله صلى الله عليه وسلم وسننه وأيامه"], era: "194-256 هـ" },
    { id: "muslim", name: "صحيح مسلم", group: "hadith_collection", level: 3, val: 15, description: "ثاني أصح كتب الحديث، جمعه الإمام مسلم بن الحجاج", scholars: ["مسلم بن الحجاج"], books: ["المسند الصحيح المختصر من السنن بنقل العدل عن العدل عن رسول الله صلى الله عليه وسلم"], era: "204-261 هـ" },
    
    // Tafsir works
    { id: "tafsir_tabari", name: "تفسير الطبري", group: "tafsir_work", level: 3, val: 15, description: "جامع البيان عن تأويل آي القرآن، من أقدم وأشمل كتب التفسير", scholars: ["محمد بن جرير الطبري"], books: ["جامع البيان عن تأويل آي القرآن"], era: "224-310 هـ" },
    { id: "tafsir_ibn_kathir", name: "تفسير ابن كثير", group: "tafsir_work", level: 3, val: 15, description: "تفسير القرآن العظيم، من أشهر كتب التفسير بالمأثور", scholars: ["إسماعيل بن عمر بن كثير"], books: ["تفسير القرآن العظيم"], era: "700-774 هـ" },
    
    // Prominent scholars
    { id: "ghazali", name: "الإمام الغزالي", group: "scholar", level: 3, val: 18, description: "فيلسوف وفقيه وصوفي، لقب بحجة الإسلام", books: ["إحياء علوم الدين", "المستصفى", "تهافت الفلاسفة"], era: "450-505 هـ" },
    { id: "ibn_taymiyyah", name: "ابن تيمية", group: "scholar", level: 3, val: 18, description: "عالم وفقيه حنبلي، من أبرز علماء المسلمين", books: ["مجموع الفتاوى", "درء تعارض العقل والنقل", "منهاج السنة النبوية"], era: "661-728 هـ" },
    { id: "ibn_qayyim", name: "ابن قيم الجوزية", group: "scholar", level: 3, val: 18, description: "تلميذ ابن تيمية، من كبار علماء الإسلام", books: ["زاد المعاد", "مدارج السالكين", "إعلام الموقعين"], era: "691-751 هـ" },
    
    // Quran sciences
    { id: "qiraat", name: "علم القراءات", group: "quran_science", level: 3, val: 15, description: "علم يبحث في كيفية نطق كلمات القرآن واختلاف ألفاظها" },
    { id: "tajweed", name: "علم التجويد", group: "quran_science", level: 3, val: 15, description: "علم يبحث في كيفية نطق الحروف القرآنية بشكل صحيح" },
  ],
  links: [
    // Core to main categories
    { source: "islam", target: "quran", value: 10 },
    { source: "islam", target: "hadith", value: 10 },
    { source: "islam", target: "fiqh", value: 10 },
    { source: "islam", target: "aqeedah", value: 10 },
    { source: "islam", target: "tafsir", value: 10 },
    
    // Main categories to subcategories
    // Fiqh to madhabs
    { source: "fiqh", target: "hanafi", value: 5 },
    { source: "fiqh", target: "maliki", value: 5 },
    { source: "fiqh", target: "shafii", value: 5 },
    { source: "fiqh", target: "hanbali", value: 5 },
    
    // Hadith to collections
    { source: "hadith", target: "bukhari", value: 5 },
    { source: "hadith", target: "muslim", value: 5 },
    
    // Tafsir to works
    { source: "tafsir", target: "tafsir_tabari", value: 5 },
    { source: "tafsir", target: "tafsir_ibn_kathir", value: 5 },
    
    // Quran to sciences
    { source: "quran", target: "qiraat", value: 5 },
    { source: "quran", target: "tajweed", value: 5 },
    
    // Scholar connections
    { source: "fiqh", target: "ghazali", value: 3 },
    { source: "aqeedah", target: "ghazali", value: 3 },
    { source: "fiqh", target: "ibn_taymiyyah", value: 3 },
    { source: "aqeedah", target: "ibn_taymiyyah", value: 3 },
    { source: "ibn_taymiyyah", target: "ibn_qayyim", value: 3 },
    { source: "hanbali", target: "ibn_taymiyyah", value: 2 },
    
    // Cross-connections
    { source: "tafsir", target: "quran", value: 8 },
    { source: "hadith", target: "fiqh", value: 8 },
    { source: "hadith", target: "tafsir", value: 5 },
    { source: "aqeedah", target: "quran", value: 5 },
    { source: "aqeedah", target: "hadith", value: 5 },
  ]
};