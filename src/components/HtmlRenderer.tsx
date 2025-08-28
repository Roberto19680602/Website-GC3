interface HtmlRendererProps {
  html: string;
}

const HtmlRenderer = ({ html }: HtmlRendererProps) => {
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
};

export default HtmlRenderer;
