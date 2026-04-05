"use client";

import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import { useEffect, useRef } from "react";

const Modal = ({ children }) => {
  const modalRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    if (!modalRef.current?.open) {
      modalRef.current?.showModal();
    }
  }, []);

  function onHide() {
    router.back();
  }

  return createPortal(
    <dialog
      ref={modalRef}
      onClose={onHide}
      className="shadow-teal-700 shadow-md border border-cyan-600/40 flex flex-col p-2 rounded-2xl bg-[var(--surface)] backdrop:bg-black/80 max-w-5xl w-full"
    >
      <span onClick={onHide} className="flex justify-end cursor-pointer mb-2">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="h-8 w-8 text-zinc-400 hover:text-white transition"
        >
          <path
            d="M18 6L6 18M6 6L18 18"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </span>
      {children}
    </dialog>,
    document.getElementById("modal-root-content")
  );
};

export default Modal;
