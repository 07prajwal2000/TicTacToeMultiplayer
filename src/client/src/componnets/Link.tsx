import { Routes, useGlobalStore } from "../store/global";
import React from "react";

interface LinkPropTypes extends React.HTMLAttributes<HTMLAnchorElement> {
	route: Routes;
}

const Link: React.FC<LinkPropTypes> = (props) => {
	const { setRoute } = useGlobalStore();
	return (
		<a
			onClick={() => setRoute(props.route)}
			{...props}
			className={"link-underline-primary cursor-pointer" + " " + props.className}
		>
      {props.children}
    </a>
	);
};

export default Link;
