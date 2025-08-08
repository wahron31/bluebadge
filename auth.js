(function(){
  const KEY_USER = 'bb_user';

  function getUser(){
    try { return JSON.parse(localStorage.getItem(KEY_USER) || 'null'); } catch { return null; }
  }

  function saveUser(user){
    localStorage.setItem(KEY_USER, JSON.stringify(user));
  }

  window.bbAuth = {
    current: getUser(),
    login(username){
      if (!username) return false;
      const user = { username, createdAt: new Date().toISOString() };
      saveUser(user);
      this.current = user;
      return true;
    },
    logout(){
      localStorage.removeItem(KEY_USER);
      this.current = null;
    },
    isLoggedIn(){
      return !!this.current;
    }
  };

  // Scope progress by user if logged in
  function scopeKey(base){
    const u = getUser();
    return u ? `${base}_${u.username}` : base;
  }

  const origGetItem = localStorage.getItem.bind(localStorage);
  const origSetItem = localStorage.setItem.bind(localStorage);

  localStorage.getItem = function(k){
    if (['cognitiveResults','languageResults','quizResults','activityHistory','learnedVocabulary','knownWords','studyWords'].includes(k)){
      return origGetItem(scopeKey(k));
    }
    return origGetItem(k);
  };
  localStorage.setItem = function(k, v){
    if (['cognitiveResults','languageResults','quizResults','activityHistory','learnedVocabulary','knownWords','studyWords'].includes(k)){
      return origSetItem(scopeKey(k), v);
    }
    return origSetItem(k, v);
  };
})();