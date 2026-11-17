import FlipBook from "./FlipBook";

export const metadata = {
  title: "Flip Book",
  description: "Interactive page-flip PDF viewer",
};

export default function FlipBookPage() {
  return (
    <FlipBook
      src="/pdf/file-example_PDF_1MB.pdf"
      title="File Example PDF"
    />
  );
}
