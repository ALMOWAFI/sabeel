// KingraphService.ts
// Service for fetching Kingraph data (real API or mock fallback)

const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true';
const API_BASE_URL = import.meta.env.VITE_KINGRAPH_API_URL || '/api/kingraph';

export interface GraphNode {
  id: string;
  label: string;
  group: string;
  size: number;
}

export interface GraphLink {
  source: string;
  target: string;
  value: number;
}

export interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

export class KingraphService {
  async getGraphData(): Promise<GraphData> {
    if (USE_MOCK_DATA) return this.getMockGraphData();
    try {
      const res = await fetch(`${API_BASE_URL}/graph`, { credentials: 'include' });
      if (!res.ok) throw new Error('API error');
      return await res.json();
    } catch (e) {
      return this.getMockGraphData();
    }
  }

  async getIsnadData(): Promise<GraphData> {
    if (USE_MOCK_DATA) return this.getMockIsnadData();
    try {
      const res = await fetch(`${API_BASE_URL}/isnad`, { credentials: 'include' });
      if (!res.ok) throw new Error('API error');
      return await res.json();
    } catch (e) {
      return this.getMockIsnadData();
    }
  }

  // --- Mock Data ---
  private getMockGraphData(): GraphData {
    return {
      nodes: [
        { id: "quran", label: "القرآن الكريم", group: "primary", size: 30 },
        { id: "hadith", label: "الحديث الشريف", group: "primary", size: 25 },
        { id: "tafsir", label: "علم التفسير", group: "science", size: 20 },
        { id: "fiqh", label: "علم الفقه", group: "science", size: 20 },
        { id: "aqeedah", label: "علم العقيدة", group: "science", size: 20 },
        { id: "usul", label: "أصول الفقه", group: "science", size: 18 },
        { id: "mustalah", label: "مصطلح الحديث", group: "science", size: 18 },
        { id: "hanafi", label: "المذهب الحنفي", group: "madhab", size: 15 },
        { id: "maliki", label: "المذهب المالكي", group: "madhab", size: 15 },
        { id: "shafii", label: "المذهب الشافعي", group: "madhab", size: 15 },
        { id: "hanbali", label: "المذهب الحنبلي", group: "madhab", size: 15 },
        { id: "bukhari", label: "الإمام البخاري", group: "scholar", size: 18 },
        { id: "muslim", label: "الإمام مسلم", group: "scholar", size: 18 },
        { id: "malik", label: "الإمام مالك", group: "scholar", size: 18 },
        { id: "abuhanifa", label: "الإمام أبو حنيفة", group: "scholar", size: 18 },
        { id: "shafii_imam", label: "الإمام الشافعي", group: "scholar", size: 18 },
        { id: "ahmad", label: "الإمام أحمد بن حنبل", group: "scholar", size: 18 },
        { id: "ibnkathir", label: "ابن كثير", group: "scholar", size: 16 },
        { id: "tabari", label: "الطبري", group: "scholar", size: 16 },
        { id: "sahih_bukhari", label: "صحيح البخاري", group: "book", size: 14 },
        { id: "sahih_muslim", label: "صحيح مسلم", group: "book", size: 14 },
        { id: "muwatta", label: "الموطأ", group: "book", size: 14 },
        { id: "tafsir_ibn_kathir", label: "تفسير ابن كثير", group: "book", size: 14 },
        { id: "tafsir_tabari", label: "تفسير الطبري", group: "book", size: 14 }
      ],
      links: [
        { source: "quran", target: "tafsir", value: 5 },
        { source: "quran", target: "fiqh", value: 4 },
        { source: "quran", target: "aqeedah", value: 4 },
        { source: "hadith", target: "fiqh", value: 4 },
        { source: "hadith", target: "mustalah", value: 5 },
        { source: "hadith", target: "aqeedah", value: 3 },
        { source: "fiqh", target: "usul", value: 4 },
        { source: "hanafi", target: "fiqh", value: 3 },
        { source: "maliki", target: "fiqh", value: 3 },
        { source: "shafii", target: "fiqh", value: 3 },
        { source: "hanbali", target: "fiqh", value: 3 },
        { source: "hanafi", target: "usul", value: 2 },
        { source: "maliki", target: "usul", value: 2 },
        { source: "shafii", target: "usul", value: 2 },
        { source: "hanbali", target: "usul", value: 2 },
        { source: "abuhanifa", target: "hanafi", value: 5 },
        { source: "malik", target: "maliki", value: 5 },
        { source: "shafii_imam", target: "shafii", value: 5 },
        { source: "ahmad", target: "hanbali", value: 5 },
        { source: "bukhari", target: "mustalah", value: 4 },
        { source: "muslim", target: "mustalah", value: 4 },
        { source: "ibnkathir", target: "tafsir", value: 4 },
        { source: "tabari", target: "tafsir", value: 4 },
        { source: "bukhari", target: "sahih_bukhari", value: 5 },
        { source: "muslim", target: "sahih_muslim", value: 5 },
        { source: "malik", target: "muwatta", value: 5 },
        { source: "ibnkathir", target: "tafsir_ibn_kathir", value: 5 },
        { source: "tabari", target: "tafsir_tabari", value: 5 },
        { source: "sahih_bukhari", target: "hadith", value: 4 },
        { source: "sahih_muslim", target: "hadith", value: 4 },
        { source: "muwatta", target: "hadith", value: 4 },
        { source: "tafsir_ibn_kathir", target: "tafsir", value: 4 },
        { source: "tafsir_tabari", target: "tafsir", value: 4 }
      ]
    };
  }

  private getMockIsnadData(): GraphData {
    return {
      nodes: [
        { id: "prophet", label: "النبي ﷺ", group: "prophet", size: 35 },
        { id: "abuhurayrah", label: "أبو هريرة", group: "companion", size: 25 },
        { id: "hammam", label: "همام بن منبه", group: "successor", size: 20 },
        { id: "maamar", label: "معمر بن راشد", group: "narrator", size: 18 },
        { id: "abdulrazzaq", label: "عبد الرزاق", group: "narrator", size: 18 },
        { id: "ahmad", label: "أحمد بن حنبل", group: "narrator", size: 18 },
        { id: "bukhari", label: "البخاري", group: "collector", size: 22 },
        { id: "muslim", label: "مسلم", group: "collector", size: 22 }
      ],
      links: [
        { source: "prophet", target: "abuhurayrah", value: 5 },
        { source: "abuhurayrah", target: "hammam", value: 4 },
        { source: "hammam", target: "maamar", value: 3 },
        { source: "maamar", target: "abdulrazzaq", value: 3 },
        { source: "abdulrazzaq", target: "ahmad", value: 3 },
        { source: "ahmad", target: "bukhari", value: 2 },
        { source: "ahmad", target: "muslim", value: 2 }
      ]
    };
  }
}

export const kingraphService = new KingraphService(); 