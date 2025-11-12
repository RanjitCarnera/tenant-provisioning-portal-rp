import logo from "./teamweave-title.svg";

type TeamWeaveTitleProps = {
  size: number;
};
function TeamWeaveTitle({ size }: TeamWeaveTitleProps) {
  return <img src={logo} width={size} />;
}

export { TeamWeaveTitle };
