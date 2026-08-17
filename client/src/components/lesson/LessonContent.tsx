import Image from "next/image";
import { Info } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "../../components/ui/alert";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";


// export type ContentBlock =
//   | { type: "heading"; level: 2 | 3; text: string }
//   | { type: "paragraph"; text: string }
//   | { type: "list"; items: string[] }
//   | { type: "code"; language: string; code: string }
//   | { type: "callout"; title: string; text: string }
//   | { type: "quote"; text: string; attribution?: string }
//   | { type: "image"; src: string; alt: string; caption?: string };


export interface LessonContentProps {
  lessonDescription?:string |null;
}

// const defaultBlocks: ContentBlock[] = [
//   {
//     type: "heading",
//     level: 2,
//     text: "Overview",
//   },
//   {
//     type: "paragraph",
//     text: "In this lesson, you'll learn how to structure a data pipeline that can scale from a single dataset to a full production workflow without rewriting your core logic.",
//   },
//   {
//     type: "heading",
//     level: 3,
//     text: "What you'll build",
//   },
//   {
//     type: "list",
//     items: [
//       "A reusable ingestion layer for raw data sources",
//       "A validation step that catches malformed records early",
//       "A transform pipeline that stays readable as it grows",
//     ],
//   },
//   {
//     type: "callout",
//     title: "Before you continue",
//     text: "Make sure you've completed the previous lesson on environment setup — this lesson assumes your project is already configured.",
//   },
//   {
//     type: "heading",
//     level: 3,
//     text: "Example transform",
//   },
//   {
//     type: "code",
//     language: "ts",
//     code: `export function normalizeRecord(record: RawRecord): CleanRecord {\n  return {\n    id: record.id,\n    name: record.name.trim(),\n    createdAt: new Date(record.created_at),\n  };\n}`,
//   },
//   {
//     type: "paragraph",
//     text: "Keeping each transform function small and pure makes it far easier to test and reuse across different pipelines later on.",
//   },
//   {
//     type: "quote",
//     text: "Code is read far more often than it is written — optimize for the person debugging it at 2am.",
//     attribution: "Lesson author",
//   },
//   {
//     type: "image",
//     src: "/images/lessons/pipeline-diagram.png",
//     alt: "Diagram of the data pipeline stages",
//     caption: "The three stages covered in this lesson.",
//   },
// ];

// function renderBlock(block: ContentBlock, index: number) {
//   switch (block.type) {
//     case "heading":
//       return block.level === 2 ? (
//         <h2
//           key={index}
//           className="font-display text-2xl font-bold tracking-tight text-foreground"
//         >
//           {block.text}
//         </h2>
//       ) : (
//         <h3
//           key={index}
//           className="font-display text-xl font-semibold tracking-tight text-foreground"
//         >
//           {block.text}
//         </h3>
//       );

//     case "paragraph":
//       return (
//         <p key={index} className="max-w-[70ch] text-base leading-7 text-muted-foreground">
//           {block.text}
//         </p>
//       );

//     case "list":
//       return (
//         <ul key={index} className="flex list-disc flex-col gap-2 pl-6 text-base leading-7 text-muted-foreground">
//           {block.items.map((item) => (
//             <li key={item}>{item}</li>
//           ))}
//         </ul>
//       );

//     case "code":
//       return (
//         <pre
//           key={index}
//           className="overflow-x-auto rounded-lg border border-border bg-muted p-4 text-sm leading-6 text-foreground"
//         >
//           <code>{block.code}</code>
//         </pre>
//       );

//     case "callout":
//       return (
//         <Alert key={index} className="border-border bg-card">
//           <Info className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
//           <AlertTitle className="text-foreground">{block.title}</AlertTitle>
//           <AlertDescription className="text-muted-foreground">
//             {block.text}
//           </AlertDescription>
//         </Alert>
//       );

//     case "quote":
//       return (
//         <blockquote
//           key={index}
//           className="border-l-2 border-primary pl-4 text-base italic leading-7 text-foreground"
//         >
//           <p>&ldquo;{block.text}&rdquo;</p>
//           {block.attribution ? (
//             <footer className="mt-2 text-sm not-italic text-muted-foreground">
//               — {block.attribution}
//             </footer>
//           ) : null}
//         </blockquote>
//       );

//     case "image":
//       return (
//         <figure key={index} className="flex flex-col gap-2">
//           <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-border bg-muted">
//             <Image src={block.src} alt={block.alt} fill sizes="100vw" className="object-cover" />
//           </div>
//           {block.caption ? (
//             <figcaption className="text-sm text-muted-foreground">
//               {block.caption}
//             </figcaption>
//           ) : null}
//         </figure>
//       );

//     default:
//       return null;
//   }
// }

export function LessonContent({ lessonDescription }: LessonContentProps) {
  return (
   <section
  aria-labelledby="lesson-content-heading"
  className="flex flex-col gap-5"
>
  <h2 id="lesson-content-heading" className="sr-only">
    Lesson reading content
  </h2>

 <article className="prose prose-neutral dark:prose-invert max-w-none">
  <ReactMarkdown
    remarkPlugins={[remarkGfm]}
    components={{
      h1: ({ children }) => (
        <h1 className="mt-10 mb-5 font-display text-3xl font-bold tracking-tight text-foreground first:mt-0">
          {children}
        </h1>
      ),

      h2: ({ children }) => (
        <h2 className="mt-8 mb-4 font-display text-2xl font-bold tracking-tight text-foreground">
          {children}
        </h2>
      ),

      h3: ({ children }) => (
        <h3 className="mt-6 mb-3 font-display text-xl font-semibold tracking-tight text-foreground">
          {children}
        </h3>
      ),

      p: ({ children }) => (
        <p className="my-5 indent-8 text-base leading-8 text-justify text-muted-foreground">
          {children}
        </p>
      ),

      ul: ({ children }) => (
        <ul className="my-5 list-disc space-y-2 pl-6 text-base leading-8 text-muted-foreground">
          {children}
        </ul>
      ),

      ol: ({ children }) => (
        <ol className="my-5 list-decimal space-y-2 pl-6 text-base leading-8 text-muted-foreground">
          {children}
        </ol>
      ),

      blockquote: ({ children }) => (
        <blockquote className="my-6 border-l-4 border-primary pl-4 italic text-foreground">
          {children}
        </blockquote>
      ),

      code: ({ children }) => (
        <code className="rounded bg-muted px-1.5 py-0.5 text-sm">
          {children}
        </code>
      ),

      pre: ({ children }) => (
        <pre className="my-6 overflow-x-auto rounded-lg border border-border bg-muted p-4 text-sm leading-6">
          {children}
        </pre>
      ),

      img: ({ src, alt }) => (
        <img
          src={src}
          alt={alt}
          className="my-6 rounded-lg border border-border"
        />
      ),

      hr: () => <hr className="my-8 border-border" />,
    }}
  >
    {lessonDescription}
  </ReactMarkdown>
</article>
</section>
  );
}