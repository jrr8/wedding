import styles from "./toast.module.css";

type ToastProps = {
  type: "success" | "error";
  message: string;
};

export const showToast = (props: ToastProps) => {
  const { type, message } = props;

  const toast = document.createElement("div");
  toast.className = "fixed top-5 left-1/2 -translate-x-1/2 p-4 rounded-md";
  toast.classList.add(styles.toast);

  if (type === "success") {
    toast.classList.add("bg-green-200");
  } else if (type === "error") {
    toast.classList.add("bg-red-200");
  }

  toast.innerHTML = `<div class="toast-message">${message}</div>`;

  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.addEventListener("animationend", () => {
      toast.remove();
    }, { once: true });
    
    requestAnimationFrame(() => {
      toast.classList.remove(styles.toast);
      toast.classList.add(styles.toastExit);
    });
  }, 3000);
};
