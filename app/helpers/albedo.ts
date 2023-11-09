import albedo from "@albedo-link/intent";

const loginWithAlbedo = async () => {
  try {
    return await albedo.publicKey({});
  } catch (error) {
    console.error(error);
  }
};

export default loginWithAlbedo;
