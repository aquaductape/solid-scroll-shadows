export const editHTMLStr = ({
  html,
  id,
  insertElementStr,
}: {
  html: string;
  id?: string;
  insertElementStr: string;
}) => {
  if (id) {
    const idRegex = new RegExp(`<([^>]*) [^>]*id="${id}"[^>]*>`);
    const regexResult = html.match(idRegex)!;

    const elementOpening = regexResult[0];
    const elementTagName = regexResult[1];
    const tagsRegex = new RegExp(`<\\/?${elementTagName}[^>]*>`, "g");
    let matchedIdElement = false;
    let nestedTagsCount = 0;
    let solved = false;

    html = html.replace(tagsRegex, (tag) => {
      if (solved) return tag;

      if (tag === elementOpening && !matchedIdElement) {
        matchedIdElement = true;
        return tag;
      }
      if (!matchedIdElement) return tag;

      if (tag.match(/<[^/!]/)) {
        nestedTagsCount++;
      }
      if (tag.match(/<\//)) {
        nestedTagsCount--;
      }

      if (nestedTagsCount > -1) return tag;

      solved = true;

      return `${insertElementStr}${tag}`;
    });

    return html;
  }

  const rootRegex = /\s*<([^\s>]*)/;
  const regexResult = html.match(rootRegex)!;
  const rootEndRegex = new RegExp(`(.*)(<\\/${regexResult[1]}>\\s*)$`);

  html = html.replace(rootEndRegex, (_, p1, p2) => {
    if (p1 && p2) {
      return `${p1}${insertElementStr}${p2}`;
    }
    return _;
  });

  return html;
};
