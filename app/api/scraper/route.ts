import { NextResponse } from "next/server";
import axios from "axios";

import domains from "@/domains.json";

export async function GET(req: Request) {
  const host: string = req.headers.get("host") as string;

  let site_url;

  if (host in domains) {
    // @ts-ignore
    site_url = domains[host];
  } else {
    site_url = "https://wise-centre-361843.framer.app";
  }

  try {
    const { data }: { data: string } = await axios.get(site_url);

    // HTML kodni o'zgartirish (ixtiyoriy)
    let modifiedHtml = data.replace("__framer-badge", "remove-badge");
    modifiedHtml = modifiedHtml.replace("<!doctype html>", "");
    modifiedHtml = modifiedHtml.replace("<html>", "");
    modifiedHtml = modifiedHtml.replace("</html>", "");

    return new NextResponse(modifiedHtml, {
      status: 200,
      headers: {
        "Content-Type": "text/html",
      },
    });
  } catch (error) {
    return new NextResponse("Xatolik yuz berdi!", { status: 500 });
  }
}
