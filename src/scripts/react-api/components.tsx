import type { CSSProperties, JSX, ReactNode } from "react";

// Inline styles for components
const styles = {
  blockStack: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "16px",
  },
  inlineStack: {
    display: "flex",
    flexDirection: "row" as const,
    gap: "16px",
    alignItems: "center" as const,
  },
  inlineLayout: {
    display: "flex",
    flexDirection: "row" as const,
    gap: "16px",
  },
  grid: {
    display: "grid",
    gap: "16px",
  },
  button: {
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "6px",
    padding: "10px 20px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600" as const,
    textDecoration: "none",
    display: "inline-block",
    textAlign: "center" as const,
    transition: "all 0.2s ease",
    boxShadow: "0 2px 4px rgba(0, 123, 255, 0.2)",
  },
  buttonHover: {
    backgroundColor: "#0056b3",
    transform: "translateY(-1px)",
    boxShadow: "0 4px 8px rgba(0, 123, 255, 0.3)",
  },
  heading: {
    margin: "0",
    fontWeight: "600" as const,
  },
  text: {
    margin: "0",
    lineHeight: "1.5",
  },
  textBold: {
    fontWeight: "600" as const,
  },
  textSmall: {
    fontSize: "12px",
  },
  link: {
    color: "#007bff",
    textDecoration: "none",
  },
  linkHover: {
    textDecoration: "underline",
  },
  divider: {
    border: "none",
    borderTop: "1px solid #e0e0e0",
    margin: "16px 0",
  },
  tag: {
    backgroundColor: "#f8f9fa",
    color: "#495057",
    padding: "4px 8px",
    borderRadius: "4px",
    fontSize: "12px",
    fontWeight: "500" as const,
    display: "inline-block",
  },
  image: {
    maxWidth: "100%",
    height: "auto",
  },
  view: {
    display: "block",
  },
  container: {
    border: "1px solid #e0e0e0",
    borderRadius: "8px",
    backgroundColor: "#ffffff",
  },
  containerSubdued: {
    backgroundColor: "#f8f9fa",
  },
  padding: {
    none: "0",
    base: "16px",
    small: "8px",
    extraTight: "4px",
  },
};

// Generic React components to replace Shopify UI components

interface BlockStackProps {
  children?: ReactNode;
  spacing?: "none" | "base" | "extraTight" | "tight";
  padding?: "none" | "base" | "extraTight";
  border?: "base";
  borderRadius?: "base";
  background?: "base" | "subdued";
  inlineAlignment?: "start" | "center" | "end";
  style?: CSSProperties;
}

export function BlockStack({
  children,
  spacing = "base",
  padding = "none",
  border,
  borderRadius,
  background = "base",
  inlineAlignment,
  style = {},
}: BlockStackProps): JSX.Element {
  const getSpacing = (spacing: string): string => {
    switch (spacing) {
      case "none":
        return "0";
      case "extraTight":
        return "4px";
      case "tight":
        return "8px";
      case "base":
        return "16px";
      default:
        return "16px";
    }
  };

  const containerStyle: CSSProperties = {
    ...styles.blockStack,
    gap: getSpacing(spacing),
    padding: styles.padding[padding as keyof typeof styles.padding],
    ...(border && { border: "1px solid #e0e0e0" }),
    ...(borderRadius && { borderRadius: "8px" }),
    ...(background === "subdued" && styles.containerSubdued),
    ...(background === "base" && { backgroundColor: "#ffffff" }),
    ...(inlineAlignment && { alignItems: inlineAlignment }),
    ...style,
  };

  return <div style={containerStyle}>{children}</div>;
}

interface InlineStackProps {
  children: ReactNode;
  spacing?: "base" | "loose";
  padding?: "none" | "base";
  background?: "base" | "subdued";
  inlineAlignment?: "start" | "center" | "end";
  style?: CSSProperties;
}

export function InlineStack({
  children,
  spacing = "base",
  padding = "none",
  background,
  inlineAlignment,
  style = {},
}: InlineStackProps): JSX.Element {
  const getSpacing = (spacing: string): string => {
    switch (spacing) {
      case "base":
        return "16px";
      case "loose":
        return "24px";
      default:
        return "16px";
    }
  };

  const containerStyle: CSSProperties = {
    ...styles.inlineStack,
    gap: getSpacing(spacing),
    padding: styles.padding[padding as keyof typeof styles.padding],
    ...(background === "subdued" && styles.containerSubdued),
    ...(background === "base" && { backgroundColor: "#ffffff" }),
    ...(inlineAlignment && { justifyContent: inlineAlignment }),
    ...style,
  };

  return <div style={containerStyle}>{children}</div>;
}

interface InlineLayoutProps {
  children: ReactNode;
  columns?: (number | string)[];
  spacing?: "base" | "loose" | "none" | ("base" | "loose" | "none")[];
  blockAlignment?: "start" | "center" | "end";
  padding?: "none" | "base";
  style?: CSSProperties;
}

export function InlineLayout({
  children,
  columns,
  spacing: _spacing,
  blockAlignment = "start",
  padding = "none",
  style = {},
}: InlineLayoutProps): JSX.Element {
  const containerStyle: CSSProperties = {
    ...styles.inlineLayout,
    alignItems: blockAlignment,
    padding: styles.padding[padding],
    ...style,
  };

  if (columns) {
    containerStyle.gridTemplateColumns = columns
      .map((col) => (typeof col === "number" ? `${col}px` : col))
      .join(" ");
    containerStyle.display = "grid";
  }

  return <div style={containerStyle}>{children}</div>;
}

interface GridProps {
  children: ReactNode;
  columns?: number | string[] | (number | string)[];
  rows?: string[];
  spacing?: "base" | "loose" | "none";
  background?: "base" | "subdued";
  style?: CSSProperties;
}

export function Grid({
  children,
  columns,
  rows,
  spacing = "base",
  background,
  style = {},
}: GridProps): JSX.Element {
  const getSpacing = (spacing: string): string => {
    switch (spacing) {
      case "none":
        return "0";
      case "base":
        return "16px";
      case "loose":
        return "24px";
      default:
        return "16px";
    }
  };

  const containerStyle: CSSProperties = {
    ...styles.grid,
    gap: getSpacing(spacing),
    ...(background === "subdued" && styles.containerSubdued),
    ...(background === "base" && { backgroundColor: "#ffffff" }),
    ...style,
  };

  if (typeof columns === "number") {
    containerStyle.gridTemplateColumns = `repeat(${columns}, 1fr)`;
  } else if (Array.isArray(columns)) {
    containerStyle.gridTemplateColumns = columns
      .map((col) => (typeof col === "number" ? `${col}px` : col))
      .join(" ");
  }

  if (rows) {
    containerStyle.gridTemplateRows = rows.join(" ");
  }

  return <div style={containerStyle}>{children}</div>;
}

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  style?: CSSProperties;
}

export function Button({
  children,
  onClick,
  style = {},
}: ButtonProps): JSX.Element {
  return (
    <button
      style={{ ...styles.button, ...style }}
      onClick={onClick}
      onMouseOver={(e) => {
        Object.assign(e.currentTarget.style, styles.buttonHover);
      }}
      onMouseOut={(e) => {
        Object.assign(e.currentTarget.style, styles.button, style);
      }}
    >
      {children}
    </button>
  );
}

interface HeadingProps {
  children: ReactNode;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  style?: CSSProperties;
}

export function Heading({
  children,
  level = 2,
  style = {},
}: HeadingProps): JSX.Element {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;
  const headingStyle: CSSProperties = {
    ...styles.heading,
    fontSize: level === 1 ? "24px" : level === 2 ? "20px" : "16px",
    ...style,
  };

  return <Tag style={headingStyle}>{children}</Tag>;
}

interface TextProps {
  children: ReactNode;
  emphasis?: "bold" | undefined;
  size?: "extraSmall";
  appearance?: "subdued";
  style?: CSSProperties;
}

export function Text({
  children,
  emphasis,
  size,
  appearance,
  style = {},
}: TextProps): JSX.Element {
  const textStyle: CSSProperties = {
    ...styles.text,
    ...(emphasis === "bold" && styles.textBold),
    ...(size === "extraSmall" && styles.textSmall),
    ...(appearance === "subdued" && { color: "#6c757d" }),
    ...style,
  };

  return <span style={textStyle}>{children}</span>;
}

interface LinkProps {
  children: ReactNode;
  to: string;
  external?: boolean;
  appearance?: "monochrome";
  style?: CSSProperties;
}

export function Link({
  children,
  to,
  external = false,
  appearance,
  style = {},
}: LinkProps): JSX.Element {
  const linkStyle: CSSProperties = {
    ...styles.link,
    ...(appearance === "monochrome" && { color: "inherit" }),
    ...style,
  };

  return (
    <a
      href={to}
      style={linkStyle}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      onMouseOver={(e) => {
        Object.assign(e.currentTarget.style, styles.linkHover);
      }}
      onMouseOut={(e) => {
        Object.assign(e.currentTarget.style, linkStyle);
      }}
    >
      {children}
    </a>
  );
}

interface DividerProps {
  style?: CSSProperties;
  alignment?: "start" | "center" | "end";
}

export function Divider({
  style = {},
  alignment: _alignment,
}: DividerProps): JSX.Element {
  return <hr style={{ ...styles.divider, ...style }} />;
}

interface TagProps {
  children: ReactNode;
  style?: CSSProperties;
}

export function Tag({ children, style = {} }: TagProps): JSX.Element {
  return <span style={{ ...styles.tag, ...style }}>{children}</span>;
}

interface ImageProps {
  source: string;
  alt?: string;
  style?: CSSProperties;
  maxWidth?: string;
  maxHeight?: string;
}

export function Image({
  source,
  alt = "",
  style = {},
  maxWidth = "100px",
  maxHeight = "100px",
}: ImageProps): JSX.Element {
  const imageStyle: CSSProperties = {
    ...styles.image,
    maxWidth,
    maxHeight,
    objectFit: "contain",
    ...style,
  };

  return <img src={source} alt={alt} style={imageStyle} />;
}

interface ViewProps {
  children?: ReactNode;
  border?: "base" | "none";
  padding?: "none" | "base";
  style?: CSSProperties;
}

export function View({
  children,
  border,
  padding = "none",
  style = {},
}: ViewProps): JSX.Element {
  const viewStyle: CSSProperties = {
    ...styles.view,
    ...(border === "base" && { border: "1px solid #e0e0e0" }),
    padding: styles.padding[padding as keyof typeof styles.padding],
    ...style,
  };

  return <div style={viewStyle}>{children}</div>;
}
