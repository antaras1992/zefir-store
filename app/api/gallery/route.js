import { NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase';

const ADMIN_PASSWORD = process.env.GALLERY_ADMIN_PASSWORD;

// GET - public, fetch all photos
export async function GET() {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from('gallery_photos')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ photos: data });
}

// POST - upload photo (admin only)
export async function POST(req) {
  const formData = await req.formData();
  const password = formData.get('password');
  if (password !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const file = formData.get('file');
  const category = formData.get('category');
  const title = formData.get('title') || '';

  if (!file || !category) {
    return NextResponse.json({ error: 'File and category required' }, { status: 400 });
  }

  const supabase = createServiceClient();
  const ext = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const arrayBuffer = await file.arrayBuffer();
  const { error: uploadError } = await supabase.storage
    .from('gallery')
    .upload(fileName, arrayBuffer, { contentType: file.type, upsert: false });

  if (uploadError) return NextResponse.json({ error: uploadError.message }, { status: 500 });

  const { data: { publicUrl } } = supabase.storage.from('gallery').getPublicUrl(fileName);

  const { error: dbError } = await supabase.from('gallery_photos').insert({
    url: publicUrl,
    category,
    title,
    file_name: fileName,
  });
  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 });

  return NextResponse.json({ success: true, url: publicUrl });
}

// DELETE - remove photo (admin only)
export async function DELETE(req) {
  const { id, file_name, password } = await req.json();
  if (password !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const supabase = createServiceClient();
  await supabase.storage.from('gallery').remove([file_name]);
  const { error } = await supabase.from('gallery_photos').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
