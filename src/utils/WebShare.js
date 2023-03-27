export function webShareCallback({ url, text, title }) {
    const shareDetails = { url, title, text };
  
    return async () => {
      if (navigator.share) {
        try {
          await navigator.share(shareDetails)
        } catch (error) {
          console.error(`Could not use web share API: ${error}`);
        }
      } else {
        console.log("Web share is currently not supported on this browser.");
      }
    };
  }