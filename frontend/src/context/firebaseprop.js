import {
    getAuth,
    GoogleAuthProvider,
    signInWithPopup,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    fetchSignInMethodsForEmail,
    EmailAuthProvider,
    linkWithCredential,
  } from "firebase/auth";
  
  const auth = getAuth();
  const googleProvider = new GoogleAuthProvider();
  
  export const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      return result.user;
    } catch (error) {
      console.error("Google Sign-In Error:", error.message);
      return null;
    }
  };
  
  export const signInWithEmail = async (email, password) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      return result.user;
    } catch (error) {
      console.error("Email Sign-In Error:", error.message);
      return null;
    }
  };
  
  export const signUpWithEmail = async (email, password) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      return result.user;
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        try {
          const methods = await fetchSignInMethodsForEmail(auth, email);
          if (methods.includes("google.com")) {
            const googleResult = await signInWithPopup(auth, googleProvider);
            const credential = EmailAuthProvider.credential(email, password);
            const linkResult = await linkWithCredential(googleResult.user, credential);
            return linkResult.user;
          }
        } catch (linkError) {
          console.error("Linking Error:", linkError.message);
          return null;
        }
      } else {
        console.error("Sign-Up Error:", error.message);
        return null;
      }
    }
  };
  
  export const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout Error:", error.message);
    }
  };
  