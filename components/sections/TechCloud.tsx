"use client";

import { useEffect, useMemo, useState } from "react";
import { Cloud, fetchSimpleIcons, renderSimpleIcon, type ICloud, type SimpleIcon } from "react-icon-cloud";

const cloudProps: Omit<ICloud, "children"> = {
  containerProps: {
    style: { display: "flex", justifyContent: "center", alignItems: "center", width: "100%", paddingTop: 40 },
  },
  options: {
    reverse: true,
    depth: 1,
    wheelZoom: false,
    imageScale: 2,
    activeCursor: "default",
    tooltip: "native",
    initial: [0.1, -0.1],
    clickToFront: 500,
    tooltipDelay: 0,
    outlineColour: "#0000",
    maxSpeed: 0.04,
    minSpeed: 0.02,
  },
};

function renderIcon(icon: SimpleIcon) {
  return renderSimpleIcon({
    icon,
    bgHex: "#0a0a0a",
    fallbackHex: "#f5f5f5",
    minContrastRatio: 2,
    size: 42,
    aProps: { href: undefined, target: undefined, rel: undefined, onClick: (e) => e.preventDefault() },
  });
}

export function TechCloud({ slugs }: { slugs: string[] }) {
  const [data, setData] = useState<Awaited<ReturnType<typeof fetchSimpleIcons>> | null>(null);

  useEffect(() => {
    fetchSimpleIcons({ slugs }).then(setData).catch(() => setData(null));
  }, [slugs]);

  const icons = useMemo(() => {
    if (!data) return null;
    return Object.values(data.simpleIcons).map((icon) => renderIcon(icon));
  }, [data]);

  if (!icons) return null;

  return (
    <Cloud {...cloudProps}>
      <>{icons}</>
    </Cloud>
  );
}
