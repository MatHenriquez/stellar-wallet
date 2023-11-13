const redirectToDashboard = (): void => {
  window.location.href = "/dashboard";
};

const savePublicKey = (publicKey: string): void => {
  localStorage.setItem("publicKey", publicKey);
};

export {
  redirectToDashboard,
  savePublicKey,
};
