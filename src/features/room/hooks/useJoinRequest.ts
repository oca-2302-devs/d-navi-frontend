import { createElement } from "react";

import { toast } from "sonner";

import { JoinRequestToast, type JoinRequestToastProps } from "../components";

export const useJoinRequest = () => {
  const showJoinRequest = (onRequestHandle: JoinRequestToastProps["onRequestHandle"]) => {
    toast.custom(
      (id) =>
        createElement(JoinRequestToast, {
          id,
          onRequestHandle,
        }),
      {
        duration: Infinity,
        position: "top-center",
      }
    );
  };

  return { showJoinRequest };
};
