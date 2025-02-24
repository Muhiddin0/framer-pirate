import axios from "axios";

export default async function RootLayout({}: Readonly<{
  children: React.ReactNode;
}>) {
  const { data } = await axios.get("http://localhost:3000/api/scraper");

  return (
    <>
      <html
        dangerouslySetInnerHTML={{ __html: data }}
        lang="en"
        suppressHydrationWarning
      ></html>
    </>
  );
}
