import { NextResponse } from "next/server";

const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const apiFormData = new FormData();
    apiFormData.append('file', file);

    const response = await fetch('https://api.calorieninjas.com/v1/imagetextnutrition', {
      method: 'POST',
      headers: {
        'X-Api-Key': API_KEY,
      },
      body: apiFormData,
    });

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Image Analysis Error:', error);
    return NextResponse.json(
      { error: "Failed to analyze image" },
      { status: 500 }
    );
  }
}