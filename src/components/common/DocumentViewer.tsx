import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import Heading from '@tiptap/extension-heading';
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import ListItem from '@tiptap/extension-list-item';
import CodeBlock from '@tiptap/extension-code-block';
import Code from '@tiptap/extension-code';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Typography from '@tiptap/extension-typography';
import { Card, CardContent } from '@/components/ui/card';

interface DocumentViewerProps {
  content: string;
  className?: string;
  title?: string;
}

// Custom styles for the editor
import './document-viewer.css';

const DocumentViewer: React.FC<DocumentViewerProps> = ({ content, className = '', title }) => {
  const editor = useEditor({
    extensions: [
      Document,
      Paragraph,
      Text,
      Heading,
      BulletList,
      OrderedList,
      ListItem,
      CodeBlock,
      Code,
      Link.configure({
        openOnClick: true,
        HTMLAttributes: {
          class: 'text-primary underline',
        },
      }),
      Image,
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      Typography,
    ],
    content,
    editable: false,
  });

  useEffect(() => {
    if (editor && content) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  return (
    <Card className={`overflow-hidden ${className}`}>
      {title && (
        <div className="border-b p-4">
          <h3 className="text-xl font-semibold">{title}</h3>
        </div>
      )}
      <CardContent className="p-4">
        <div className="prose dark:prose-invert max-w-none prose-headings:font-bold prose-headings:text-primary prose-a:text-primary prose-code:text-primary-foreground prose-code:bg-primary/10 prose-code:rounded prose-code:px-1 prose-code:py-0.5 prose-pre:bg-muted prose-pre:text-muted-foreground prose-img:rounded-md prose-li:marker:text-primary">
          {editor && <EditorContent editor={editor} />}
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentViewer; 