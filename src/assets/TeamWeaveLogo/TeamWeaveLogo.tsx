import { TeamWeaveIcon } from "@assets/TeamWeaveIcon/TeamWeaveIcon";
import { TeamWeaveTitle } from "@assets/TeamWeaveTitle/TeamWeaveTitle";

type TeamWeaveLogoProps = {
  size: number;
  gap?: number;
  spinning?: boolean;
};
function TeamWeaveLogo({ size, gap, spinning }: TeamWeaveLogoProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: `${gap ? gap : 8}px`,
      }}
    >
      <TeamWeaveIcon size={size} spinning={spinning} />
      <TeamWeaveTitle size={size * 5} />
    </div>
  );
}

export { TeamWeaveLogo };
