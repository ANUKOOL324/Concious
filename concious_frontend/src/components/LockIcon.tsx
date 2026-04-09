import { BrianIcon } from "../Icon/BrainIcon";

export const CenterBrand = () => {
  return (
    <g
      transform="translate(400 300) scale(0.12) translate(-256 -256)"
      style={{ pointerEvents: "none" }}
    >
      <BrianIcon />
      <text
        x="189"
        y="564"
        textAnchor="middle"
        fill="#070000"
        fontSize="74"
        fontWeight="452"
        className="select-none "
      >
        Conc
      </text>
      <text
        x="340"
        y="564"
        textAnchor="middle"
        fill="#8d80bc"
        fontSize="74"
        fontWeight="452"
        className="select-none "
      >
        ious
      </text>
    </g>
  );
};
