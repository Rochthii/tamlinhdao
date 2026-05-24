import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const supabase: SupabaseClient | null = (supabaseUrl && supabaseKey) ? createClient(supabaseUrl, supabaseKey) : null;

export async function fetchTable(table: string) {
  if (!supabase) return null;
  const { data, error } = await supabase.from(table).select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function fetchComments(articleId: string) {
  if (!supabase) return null;
  const { data, error } = await supabase.from('comments').select('*').eq('article_id', articleId).order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function postComment(articleId: string, payload: { name: string; content: string; mood?: string }) {
  if (!supabase) return null;
  const { data, error } = await supabase.from('comments').insert({ article_id: articleId, name: payload.name, content: payload.content, mood: payload.mood || null }).select().single();
  if (error) throw error;
  return data;
}

export async function fetchArticleStats(articleIds?: string[]) {
  if (!supabase) return null;
  let query = supabase.from('article_stats').select('*');
  if (articleIds && articleIds.length) query = query.in('article_id', articleIds as any);
  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function incrementArticleStat(articleId: string, field: 'likes' | 'bookmarks' | 'views') {
  if (!supabase) return null;
  // Fetch existing
  const { data: existing, error: err1 } = await supabase.from('article_stats').select('*').eq('article_id', articleId).maybeSingle();
  if (err1) throw err1;
  if (!existing) {
    const insert: any = { article_id: articleId, likes: 0, bookmarks: 0, views: 0 };
    insert[field] = 1;
    const { data: ins, error: err2 } = await supabase.from('article_stats').insert(insert).select().single();
    if (err2) throw err2;
    return ins;
  }
  const newVal = (existing[field] || 0) + 1;
  const { data: upd, error: err3 } = await supabase.from('article_stats').update({ [field]: newVal }).eq('article_id', articleId).select().single();
  if (err3) throw err3;
  return upd;
}

// Category helpers
export async function fetchCategories() {
  if (!supabase) return null;
  const { data, error } = await supabase.from('categories').select('*').order('name', { ascending: true });
  if (error) throw error;
  return data;
}

export async function createCategory(name: string, slug?: string, description?: string) {
  if (!supabase) return null;
  const payload: any = { name, slug: slug || name.toLowerCase().replace(/\s+/g, '-'), description };
  const { data, error } = await supabase.from('categories').insert([payload]).select().single();
  if (error) throw error;
  return data;
}

// Article with categories helpers
export async function createArticleWithCategories(article: any, categoryIds: string[]) {
  if (!supabase) return null;
  const { data: art, error: err1 } = await supabase.from('articles').insert([article]).select().single();
  if (err1) throw err1;
  const articleId = (art as any).id;
  if (categoryIds && categoryIds.length) {
    const refs = categoryIds.map((cid: string) => ({ article_id: articleId, category_id: cid }));
    const { error: err2 } = await supabase.from('article_categories').insert(refs);
    if (err2) throw err2;
  }
  return art;
}

export async function updateArticleWithCategories(articleId: string, article: any, categoryIds: string[]) {
  if (!supabase) return null;
  const { data: art, error: err1 } = await supabase.from('articles').update(article).eq('id', articleId).select().single();
  if (err1) throw err1;
  // replace categories
  const { error: delErr } = await supabase.from('article_categories').delete().eq('article_id', articleId);
  if (delErr) throw delErr;
  if (categoryIds && categoryIds.length) {
    const refs = categoryIds.map((cid: string) => ({ article_id: articleId, category_id: cid }));
    const { error: insErr } = await supabase.from('article_categories').insert(refs);
    if (insErr) throw insErr;
  }
  return art;
}
