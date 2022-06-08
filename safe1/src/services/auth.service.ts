////import firebase from '@/api/firebase';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';

GoogleSignin.configure({
  webClientId: "1093645070689-he5i4cbgd5hpulhg0tdmsp5c8j5sjkaa.apps.googleusercontent.com",
});

class AuthService {
  async signInWithGoogle() {
    try {
      let { idToken } = await GoogleSignin.signIn();
      // let googleCredential = firebase.auth.GoogleAuthProvider.credential(idToken);
      // await firebase.auth().signInWithCredential(googleCredential);
      // return firebase.auth().currentUser;
    } catch (err) {
      if (err.code !== statusCodes.SIGN_IN_CANCELLED) throw err;
    }
  }

  async signOut() {
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      //await firebase.auth().signOut();
    } catch (err) {
      throw err;
    }
  }
};

export default new AuthService();