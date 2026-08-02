import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const accessToken = (session as any)?.accessToken;

  if (!session || !accessToken) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  const folderId =
    req.nextUrl.searchParams.get("folderId") ?? process.env.DRIVE_FOLDER_ID;

  if (!folderId) {
    return NextResponse.json(
      { error: "No folder configured. Set DRIVE_FOLDER_ID." },
      { status: 400 }
    );
  }

  const params = new URLSearchParams({
    q: `'${folderId}' in parents and trashed = false`,
    fields:
      "files(id,name,mimeType,size,modifiedTime,thumbnailLink,iconLink,webViewLink)",
    orderBy: "folder,name_natural",
    pageSize: "200",
  });

  const res = await fetch(
    `https://www.googleapis.com/drive/v3/files?${params.toString()}`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );

  if (!res.ok) {
    const errBody = await res.text();
    return NextResponse.json(
      { error: "Drive API request failed", detail: errBody },
      { status: res.status }
    );
  }

  const data = await res.json();
  return NextResponse.json({ files: data.files ?? [], folderId });
}
