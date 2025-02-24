import { NextResponse, NextRequest } from "next/server";
import domains from "@/domains.json";
import fs from "fs/promises";

export async function GET(_req: NextRequest) {
  return NextResponse.json(domains, {
    status: 200,
  });
}

export async function POST(req: NextRequest) {
  try {
    const { domain, url } = await req.json();

    if (!domain || !url) {
      return NextResponse.json(
        { error: "Domain va URL majburiy" },
        { status: 400 }
      );
    }

    const currentDomains = domains;
    // @ts-ignore
    currentDomains[domain] = url;

    await fs.writeFile(
      "domains.json",
      JSON.stringify(currentDomains, null, 2),
      "utf-8"
    );

    return NextResponse.json(
      { message: "Muvaffaqiyatli qo'shildi", domains: currentDomains },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ error: "Server xatosi" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { domain, url } = await req.json();

    if (!domain || !url) {
      return NextResponse.json(
        { error: "Domain va URL majburiy" },
        { status: 400 }
      );
    }

    const currentDomains = domains;

    // Agar domain mavjud bo'lmasa xato qaytarish
    // @ts-ignore
    if (!currentDomains[domain]) {
      return NextResponse.json(
        { error: "Bu domain topilmadi" },
        { status: 404 }
      );
    }

    // @ts-ignore
    currentDomains[domain] = url;

    await fs.writeFile(
      "domains.json",
      JSON.stringify(currentDomains, null, 2),
      "utf-8"
    );

    return NextResponse.json(
      { message: "Muvaffaqiyatli yangilandi", domains: currentDomains },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: "Server xatosi" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { domain } = await req.json();

    if (!domain) {
      return NextResponse.json({ error: "Domain majburiy" }, { status: 400 });
    }

    const currentDomains = domains;

    // Agar domain mavjud bo'lmasa xato qaytarish
    // @ts-ignore
    if (!currentDomains[domain]) {
      return NextResponse.json(
        { error: "Bu domain topilmadi" },
        { status: 404 }
      );
    }

    // @ts-ignore
    delete currentDomains[domain];

    await fs.writeFile(
      "domains.json",
      JSON.stringify(currentDomains, null, 2),
      "utf-8"
    );

    return NextResponse.json(
      { message: "Muvaffaqiyatli o'chirildi", domains: currentDomains },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: "Server xatosi" }, { status: 500 });
  }
}
