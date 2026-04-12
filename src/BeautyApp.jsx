import { useState, useRef, useEffect } from "react";
import { supabase } from "./supabaseClient";

const STATIC_MASTERS = [
  { id: 1, name: "Аліна Соколова", specialty: "Бровіст & Візажист", rating: 4.9, reviews_count: 312, distance: "0.8 км", price_from: 800, tags: ["Брови", "Макіяж", "Ламінування"], availability: "Сьогодні вільна", bio: "7 років досвіду. Спеціалізуюсь на натуральному макіяжі та архітектурі брів.", avatar_url: "https://i.pravatar.cc/300?img=47", portfolio_urls: ["https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=400&h=500&fit=crop","https://images.unsplash.com/photo-1519415943484-9fa1873496d4?w=400&h=500&fit=crop","https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&h=500&fit=crop","https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=400&h=500&fit=crop"], is_verified: true, address: "вул. Хрещатик, 14", is_promoted: true },
  { id: 2, name: "Оксана Лисенко", specialty: "Нейл-майстер", rating: 4.8, reviews_count: 198, distance: "1.2 км", price_from: 550, tags: ["Манікюр", "Педикюр", "Гель-лак"], availability: "Завтра з 10:00", bio: "Nail-art майстриня. Люблю мінімалізм і складний дизайн.", avatar_url: "https://i.pravatar.cc/300?img=45", portfolio_urls: ["https://images.unsplash.com/photo-1604654894610-df63bc536fac?w=400&h=500&fit=crop","https://images.unsplash.com/photo-1604654894533-1c5a9c4c5e49?w=400&h=500&fit=crop","https://images.unsplash.com/photo-1604654894568-9ff3bdf3b5da?w=400&h=500&fit=crop","https://images.unsplash.com/photo-1604655406337-96d2b8c0f1dc?w=400&h=500&fit=crop"], is_verified: true, address: "вул. Саксаганського, 32", is_promoted: false },
  { id: 3, name: "Марина Дорошенко", specialty: "Перукар-стиліст", rating: 4.95, reviews_count: 421, distance: "2.1 км", price_from: 1200, tags: ["Стрижка", "Фарбування", "Кератин"], availability: "Сьогодні з 15:00", bio: "Топ-майстер міста. 12 років у сфері.", avatar_url: "https://i.pravatar.cc/300?img=44", portfolio_urls: ["https://images.unsplash.com/photo-1560869713-da86a9ec0744?w=400&h=500&fit=crop","https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=400&h=500&fit=crop","https://images.unsplash.com/photo-1562322140-8baeececf3df?w=400&h=500&fit=crop","https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=400&h=500&fit=crop"], is_verified: true, address: "вул. Велика Васильківська, 77", is_promoted: false },
  { id: 4, name: "Катерина Іванова", specialty: "Лешмейкер", rating: 4.7, reviews_count: 156, distance: "0.5 км", price_from: 700, tags: ["Нарощування вій", "Ламінування вій", "Біозавивка"], availability: "Сьогодні вільна", bio: "Ніжний погляд — моя справа. Навчалась у Кореї.", avatar_url: "https://i.pravatar.cc/300?img=43", portfolio_urls: ["https://images.unsplash.com/photo-1583001809873-a128495da465?w=400&h=500&fit=crop","https://images.unsplash.com/photo-1574169208507-84376144848b?w=400&h=500&fit=crop","https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=400&h=500&fit=crop","https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400&h=500&fit=crop"], is_verified: false, address: "пр. Перемоги, 5", is_promoted: false },
  { id: 5, name: "Юлія Момот", specialty: "Косметолог", rating: 4.9, reviews_count: 287, distance: "3.0 км", price_from: 1500, tags: ["Чищення", "Пілінг", "Мезотерапія"], availability: "Завтра з 9:00", bio: "Лікар-дерматолог з медичною освітою. Апаратна косметологія.", avatar_url: "https://i.pravatar.cc/300?img=48", portfolio_urls: ["https://images.unsplash.com/photo-1619451050621-83cb7aada2d7?w=400&h=500&fit=crop","https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=400&h=500&fit=crop","https://images.unsplash.com/photo-1532413992378-f169ac26fff0?w=400&h=500&fit=crop","https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=400&h=500&fit=crop"], is_verified: true, address: "вул. Золотоворітська, 2", is_promoted: true },
];

const normalizeMaster = (m) => ({ ...m, avatar: m.avatar_url, portfolio: m.portfolio_urls || [], verified: m.is_verified, promoted: m.is_promoted, rating: parseFloat(m.rating) || 5.0, reviews: m.reviews_count || 0, distance: m.distance || "—", price: m.price_from ? `від ${m.price_from} ₴` : "—" });
const CATEGORIES = ["Всі", "Брови", "Нігті", "Волосся", "Вії", "Обличчя", "Макіяж"];

// Кольорова палітра
const C = {
  bg: "#FAF8F5",
  white: "#FFFFFF",
  pink: "#F2A8BC",
  pinkLight: "#FDE8EF",
  pinkMid: "#E8899A",
  pinkDark: "#D4657A",
  gold: "#C9A96E",
  goldLight: "#F0E6D3",
  goldMid: "#B8935A",
  text: "#2A2025",
  textMid: "#7A6570",
  textLight: "#B0A0A8",
  border: "#EDE0E6",
  green: "#4CAF82",
};

export default function BeautyApp() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [masters, setMasters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dbConnected, setDbConnected] = useState(false);
  const [screen, setScreen] = useState("discover");
  const [cardIndex, setCardIndex] = useState(0);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [likedIds, setLikedIds] = useState([]);
  const [matches, setMatches] = useState([]);
  const [matchIds, setMatchIds] = useState({});
  const [messages, setMessages] = useState({});
  const [activeChat, setActiveChat] = useState(null);
  const [chatInput, setChatInput] = useState("");
  const [swipeAnim, setSwipeAnim] = useState(null);
  const [matchOverlay, setMatchOverlay] = useState(null);
  const [profileModal, setProfileModal] = useState(null);
  const [activeCategory, setActiveCategory] = useState("Всі");
  const msgEnd = useRef(null);
  const realtimeRef = useRef(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => { setUser(session?.user ?? null); setAuthLoading(false); });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => setUser(session?.user ?? null));
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        const { data, error } = await supabase.from("masters").select("*").order("is_promoted", { ascending: false }).order("rating", { ascending: false });
        if (error) throw error;
        if (data?.length > 0) { setMasters(data.map(normalizeMaster)); setDbConnected(true); }
        else setMasters(STATIC_MASTERS.map(normalizeMaster));
      } catch { setMasters(STATIC_MASTERS.map(normalizeMaster)); }
      finally { setLoading(false); }
    };
    load();
  }, []);

  useEffect(() => {
    if (!user || masters.length === 0) return;
    const loadUserData = async () => {
      try {
        const { data: likesData } = await supabase.from("likes").select("to_master").eq("from_user", user.id);
        if (likesData) setLikedIds(likesData.map(l => l.to_master));
        const { data: matchesData } = await supabase.from("matches").select("id, master_id").eq("user_id", user.id);
        if (matchesData?.length > 0) {
          const ids = matchesData.map(m => m.master_id);
          const matched = masters.filter(m => ids.includes(m.id));
          setMatches(matched);
          const mIds = {};
          matchesData.forEach(m => { mIds[m.master_id] = m.id; });
          setMatchIds(mIds);
          const allMessages = {};
          for (const match of matchesData) {
            const { data: msgsData } = await supabase.from("messages").select("*").eq("match_id", match.id).order("created_at", { ascending: true });
            if (msgsData) {
              allMessages[match.master_id] = msgsData.map(msg => ({ id: msg.id, from: msg.sender_id === user.id ? "user" : "master", text: msg.text, time: new Date(msg.created_at).toLocaleTimeString("uk", { hour: "2-digit", minute: "2-digit" }) }));
            }
          }
          setMessages(allMessages);
        }
      } catch (e) { console.error(e); }
    };
    loadUserData();
  }, [user, masters]);

  useEffect(() => {
    if (!user || Object.keys(matchIds).length === 0) return;
    if (realtimeRef.current) supabase.removeChannel(realtimeRef.current);
    const matchIdList = Object.values(matchIds);
    const channel = supabase.channel("messages-realtime").on("postgres_changes", { event: "INSERT", schema: "public", table: "messages" }, (payload) => {
      const msg = payload.new;
      if (!matchIdList.includes(msg.match_id)) return;
      const masterId = Object.keys(matchIds).find(k => matchIds[k] === msg.match_id);
      if (!masterId) return;
      const newMsg = { id: msg.id, from: msg.sender_id === user.id ? "user" : "master", text: msg.text, time: new Date(msg.created_at).toLocaleTimeString("uk", { hour: "2-digit", minute: "2-digit" }) };
      setMessages(prev => ({ ...prev, [masterId]: [...(prev[masterId] || []), newMsg] }));
    }).subscribe();
    realtimeRef.current = channel;
    return () => { supabase.removeChannel(channel); };
  }, [user, matchIds]);

  useEffect(() => { msgEnd.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, activeChat]);

  const signInWithGoogle = async () => { await supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo: window.location.origin } }); };
  const signOut = async () => { await supabase.auth.signOut(); setLikedIds([]); setMatches([]); setMatchIds({}); setMessages({}); };

  const master = masters[cardIndex % (masters.length || 1)];

  const swipe = async (dir) => {
    if (!master) return;
    setSwipeAnim(dir);
    setTimeout(async () => {
      setSwipeAnim(null); setPhotoIndex(0);
      if (dir === "right") {
        setLikedIds(p => [...p, master.id]);
        if (user && !matches.find(m => m.id === master.id)) {
          try {
            await supabase.from("likes").upsert({ from_user: user.id, to_master: master.id });
            const { data: matchData } = await supabase.from("matches").upsert({ user_id: user.id, master_id: master.id }).select("id").single();
            if (matchData) {
              setMatchIds(prev => ({ ...prev, [master.id]: matchData.id }));
              await supabase.from("messages").insert({ match_id: matchData.id, sender_id: user.id, text: `Привіт! Я ${master.name} ✨ Рада нашому матчу!` });
            }
          } catch (e) { console.error(e); }
          setMatches(p => [...p, master]);
          setMatchOverlay(master);
        }
      }
      setCardIndex(p => p + 1);
    }, 340);
  };

  const sendMsg = async () => {
    if (!chatInput.trim() || !activeChat) return;
    const txt = chatInput; setChatInput("");
    const matchId = matchIds[activeChat];
    if (!matchId || !user) return;
    try {
      await supabase.from("messages").insert({ match_id: matchId, sender_id: user.id, text: txt });
      const replies = ["Звісно! 😊", "Гарний вибір! 💅", "Так, цей час вільний!", "Напишіть коли зручно ✨", "Дякую! Чекаю вас 💕"];
      setTimeout(async () => { await supabase.from("messages").insert({ match_id: matchId, sender_id: "00000000-0000-0000-0000-000000000000", text: replies[Math.floor(Math.random() * replies.length)] }); }, 1200);
    } catch (e) { console.error(e); }
  };

  const activeChatMessages = activeChat ? (messages[activeChat] || []) : [];
  const activeChatMaster = activeChat ? matches.find(m => m.id === activeChat) : null;

  if (authLoading || loading) return (
    <div style={{ ...S.app, alignItems: "center", justifyContent: "center", gap: 20, background: C.bg }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}} @keyframes fadeIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}`}</style>
      <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 36, color: C.pinkDark, fontWeight: 700, letterSpacing: "-0.5px" }}>Beauty<span style={{ color: C.gold }}>Match</span></div>
      <div style={{ width: 32, height: 32, borderRadius: "50%", border: `2px solid ${C.pinkLight}`, borderTop: `2px solid ${C.pink}`, animation: "spin 0.9s linear infinite" }} />
    </div>
  );

  if (!user) return (
    <div style={{ ...S.app, background: C.bg }}>
      <style>{CSS}</style>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 32px" }}>
        {/* Декоративні елементи */}
        <div style={{ position: "absolute", top: 60, right: 30, width: 80, height: 80, borderRadius: "50%", background: C.pinkLight, opacity: 0.6 }} />
        <div style={{ position: "absolute", top: 120, left: 20, width: 50, height: 50, borderRadius: "50%", background: C.goldLight, opacity: 0.7 }} />
        <div style={{ position: "absolute", bottom: 200, right: 20, width: 60, height: 60, borderRadius: "50%", background: C.pinkLight, opacity: 0.5 }} />

        <div style={{ textAlign: "center", width: "100%", zIndex: 1 }}>
          <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 80, height: 80, borderRadius: 24, background: `linear-gradient(135deg, ${C.pink}, ${C.pinkDark})`, marginBottom: 24, boxShadow: `0 12px 32px ${C.pink}55` }}>
            <span style={{ fontSize: 36 }}>✦</span>
          </div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 42, fontWeight: 700, color: C.text, lineHeight: 1.1, marginBottom: 8 }}>Beauty<br/><span style={{ color: C.pinkDark }}>Match</span></h1>
          <p style={{ color: C.textMid, fontFamily: "'DM Sans', sans-serif", fontSize: 15, marginBottom: 48, lineHeight: 1.6 }}>Знаходь найкращих майстрів краси поряд з тобою</p>

          <button onClick={signInWithGoogle} style={{ width: "100%", padding: "16px", background: C.white, border: `1.5px solid ${C.border}`, borderRadius: 16, color: C.text, fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 15, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 16, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
            <svg width="20" height="20" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Увійти через Google
          </button>
          <p style={{ color: C.textLight, fontFamily: "'DM Sans', sans-serif", fontSize: 12 }}>Натискаючи кнопку, ви погоджуєтесь з умовами</p>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ ...S.app, background: C.bg }}>
      <style>{CSS}</style>

      {matchOverlay && (
        <div style={S.overlay}>
          <div style={{ background: C.white, borderRadius: 28, padding: "40px 28px", textAlign: "center", maxWidth: 320, width: "90%", boxShadow: "0 24px 64px rgba(0,0,0,0.12)", position: "relative", overflow: "hidden" }} className="pop">
            <div style={{ position: "absolute", top: -30, right: -30, width: 120, height: 120, borderRadius: "50%", background: C.pinkLight }} />
            <div style={{ position: "absolute", bottom: -20, left: -20, width: 80, height: 80, borderRadius: "50%", background: C.goldLight }} />
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, fontWeight: 700, color: C.text, marginBottom: 6, position: "relative" }}>Це матч! 🎉</p>
            <p style={{ color: C.textMid, fontFamily: "'DM Sans', sans-serif", fontSize: 14, marginBottom: 24, position: "relative" }}>Ви сподобались одне одному!</p>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 20, position: "relative" }}>
              <img src={user?.user_metadata?.avatar_url || "https://i.pravatar.cc/100?img=9"} style={{ width: 76, height: 76, borderRadius: "50%", objectFit: "cover", border: `3px solid ${C.pink}` }} alt="" />
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: `linear-gradient(135deg, ${C.pink}, ${C.pinkDark})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>♥</div>
              <img src={matchOverlay.avatar_url} style={{ width: 76, height: 76, borderRadius: "50%", objectFit: "cover", border: `3px solid ${C.pink}` }} alt="" />
            </div>
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 600, color: C.text, marginBottom: 4, position: "relative" }}>{matchOverlay.name}</p>
            <p style={{ color: C.textMid, fontFamily: "'DM Sans', sans-serif", fontSize: 13, marginBottom: 24, position: "relative" }}>{matchOverlay.specialty}</p>
            <button style={{ width: "100%", padding: "14px", background: `linear-gradient(135deg, ${C.pink}, ${C.pinkDark})`, border: "none", borderRadius: 14, color: C.white, fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 15, cursor: "pointer", marginBottom: 10, position: "relative", boxShadow: `0 8px 24px ${C.pink}55` }} onClick={() => { setMatchOverlay(null); setActiveChat(matchOverlay.id); setScreen("chat"); }}>Написати зараз</button>
            <button style={{ background: "none", border: "none", color: C.textLight, fontFamily: "'DM Sans', sans-serif", fontSize: 13, cursor: "pointer", width: "100%", padding: "6px", position: "relative" }} onClick={() => setMatchOverlay(null)}>Пізніше</button>
          </div>
        </div>
      )}

      {profileModal && (
        <div style={S.overlay} onClick={() => setProfileModal(null)}>
          <div style={{ background: C.white, width: "100%", maxHeight: "92vh", borderRadius: "24px 24px 0 0", overflow: "hidden", position: "relative" }} onClick={e => e.stopPropagation()}>
            <button style={{ position: "absolute", top: 14, right: 14, background: "rgba(0,0,0,0.06)", border: "none", color: C.text, fontSize: 14, width: 32, height: 32, borderRadius: "50%", cursor: "pointer", zIndex: 5, display: "flex", alignItems: "center", justifyContent: "center" }} onClick={() => setProfileModal(null)}>✕</button>
            <div style={{ overflowY: "auto", maxHeight: "92vh" }}>
              <img src={(profileModal.portfolio_urls || profileModal.portfolio)?.[0]} style={{ width: "100%", height: 220, objectFit: "cover", display: "block" }} alt="" />
              <div style={{ padding: "20px 20px 40px" }}>
                <div style={{ display: "flex", gap: 14, alignItems: "flex-start", marginBottom: 16 }}>
                  <img src={profileModal.avatar_url} style={{ width: 64, height: 64, borderRadius: "50%", objectFit: "cover", border: `2px solid ${C.pink}`, flexShrink: 0 }} alt="" />
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: C.text }}>{profileModal.name}</span>
                      {(profileModal.is_verified || profileModal.verified) && <span style={{ background: `linear-gradient(135deg, ${C.gold}, ${C.goldMid})`, color: C.white, borderRadius: "50%", width: 18, height: 18, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700 }}>✓</span>}
                    </div>
                    <p style={{ color: C.pinkDark, fontFamily: "'DM Sans', sans-serif", fontSize: 13, marginTop: 2 }}>{profileModal.specialty}</p>
                    <p style={{ color: C.textMid, fontFamily: "'DM Sans', sans-serif", fontSize: 12, marginTop: 2 }}>⭐ {profileModal.rating} · 📍 {profileModal.distance} · {profileModal.price || `від ${profileModal.price_from} ₴`}</p>
                  </div>
                </div>
                <p style={{ color: C.textMid, fontFamily: "'DM Sans', sans-serif", fontSize: 14, lineHeight: 1.6, marginBottom: 16 }}>{profileModal.bio}</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>{(profileModal.tags || []).map(t => <span key={t} style={{ background: C.pinkLight, color: C.pinkDark, borderRadius: 20, padding: "5px 12px", fontSize: 12, fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}>{t}</span>)}</div>
                <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, fontWeight: 600, color: C.text, marginBottom: 12 }}>Портфоліо</p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 16 }}>{(profileModal.portfolio_urls || profileModal.portfolio || []).map((src, i) => <img key={i} src={src} style={{ width: "100%", height: 130, objectFit: "cover", borderRadius: 14 }} alt="" />)}</div>
                <p style={{ color: C.textLight, fontFamily: "'DM Sans', sans-serif", fontSize: 13 }}>📍 {profileModal.address}</p>
                {profileModal.availability && <div style={{ display: "flex", alignItems: "center", gap: 7, marginTop: 12 }}><div style={{ width: 8, height: 8, borderRadius: "50%", background: C.green }} /><span style={{ color: C.textMid, fontFamily: "'DM Sans', sans-serif", fontSize: 13 }}>{profileModal.availability}</span></div>}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DISCOVER */}
      {screen === "discover" && master && (
        <div style={S.screen}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px 12px", background: C.white, borderBottom: `1px solid ${C.border}` }}>
            <div>
              <p style={{ color: C.textLight, fontSize: 10, fontWeight: 600, letterSpacing: "1.5px", textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif", marginBottom: 1 }}>Київ · 5 км</p>
              <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 700, color: C.text, lineHeight: 1 }}>Beauty<span style={{ color: C.pinkDark }}>Match</span></h1>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button style={{ background: C.pinkLight, border: "none", borderRadius: 12, width: 38, height: 38, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.pinkDark} strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              </button>
              <button style={{ background: C.goldLight, border: "none", borderRadius: 12, width: 38, height: 38, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.goldMid} strokeWidth="2.5"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
              </button>
            </div>
          </div>

          <div style={{ display: "flex", gap: 8, padding: "12px 16px", overflowX: "auto", background: C.white }}>
            {CATEGORIES.map(c => (
              <button key={c} style={{ border: "none", borderRadius: 20, padding: "7px 16px", fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.2s", background: activeCategory === c ? `linear-gradient(135deg, ${C.pink}, ${C.pinkDark})` : C.pinkLight, color: activeCategory === c ? C.white : C.pinkDark }} onClick={() => setActiveCategory(c)}>{c}</button>
            ))}
          </div>

          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "12px 16px", overflow: "hidden" }}>
            <div key={cardIndex} className={`card-in ${swipeAnim === "right" ? "go-right" : swipeAnim === "left" ? "go-left" : ""}`} style={{ width: "100%", maxWidth: 390, borderRadius: 24, overflow: "hidden", background: C.white, boxShadow: "0 8px 32px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)", position: "relative" }}>
              {(master.is_promoted || master.promoted) && <div style={{ position: "absolute", top: 14, right: 14, background: `linear-gradient(135deg, ${C.gold}, ${C.goldMid})`, borderRadius: 20, padding: "4px 12px", fontSize: 10, fontWeight: 700, color: C.white, zIndex: 5, fontFamily: "'DM Sans', sans-serif" }}>⚡ Топ майстер</div>}
              {likedIds.includes(master.id) && <div style={{ position: "absolute", top: 14, left: 14, background: "rgba(76,175,130,0.15)", border: `1px solid ${C.green}`, borderRadius: 20, padding: "4px 12px", fontSize: 10, color: C.green, zIndex: 5, fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>✓ Лайкнуто</div>}
              <div className={`stamp-like ${swipeAnim === "right" ? "show-stamp" : ""}`}>ЛАЙК</div>
              <div className={`stamp-nope ${swipeAnim === "left" ? "show-stamp" : ""}`}>ПРОПУСК</div>

              <div style={{ position: "relative", height: 440 }}>
                <img src={(master.portfolio_urls || master.portfolio)?.[photoIndex]} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} alt="" />
                <div style={{ position: "absolute", top: 10, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 5, zIndex: 5 }}>
                  {(master.portfolio_urls || master.portfolio || []).map((_, i) => <div key={i} onClick={() => setPhotoIndex(i)} style={{ height: 3, width: 26, borderRadius: 2, background: i === photoIndex ? C.white : "rgba(255,255,255,0.5)", cursor: "pointer", transition: "all 0.2s" }} />)}
                </div>
                <div style={{ position: "absolute", top: 0, left: 0, width: "40%", height: "100%", zIndex: 4 }} onClick={() => setPhotoIndex(Math.max(0, photoIndex - 1))} />
                <div style={{ position: "absolute", top: 0, right: 0, width: "40%", height: "100%", zIndex: 4 }} onClick={() => setPhotoIndex((photoIndex + 1) % Math.max(1, (master.portfolio_urls || master.portfolio || []).length))} />
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "60%", background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 100%)", zIndex: 3 }} />
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "16px 18px 14px", zIndex: 4 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                    <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 700, color: C.white }}>{master.name}</span>
                    {(master.is_verified || master.verified) && <span style={{ background: `linear-gradient(135deg, ${C.gold}, ${C.goldMid})`, color: C.white, borderRadius: "50%", width: 18, height: 18, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700, flexShrink: 0 }}>✓</span>}
                  </div>
                  <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 12, fontFamily: "'DM Sans', sans-serif", marginBottom: 8 }}>{master.specialty}</p>
                  <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
                    {["⭐ " + master.rating, "📍 " + master.distance, "💳 " + (master.price || `від ${master.price_from} ₴`)].map(v => <span key={v} style={{ background: "rgba(255,255,255,0.18)", backdropFilter: "blur(8px)", borderRadius: 10, padding: "3px 9px", fontSize: 11, color: C.white, fontFamily: "'DM Sans', sans-serif" }}>{v}</span>)}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 8 }}>
                    <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#6EE8A2" }} />
                    <span style={{ color: "rgba(255,255,255,0.85)", fontSize: 12, fontFamily: "'DM Sans', sans-serif" }}>{master.availability}</span>
                  </div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
                    {(master.tags || []).slice(0, 3).map(t => <span key={t} style={{ background: "rgba(242,168,188,0.25)", backdropFilter: "blur(8px)", color: C.white, borderRadius: 20, padding: "4px 10px", fontSize: 11, fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}>{t}</span>)}
                  </div>
                  <button style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.35)", color: C.white, borderRadius: 20, padding: "6px 14px", fontSize: 12, fontFamily: "'DM Sans', sans-serif", cursor: "pointer", fontWeight: 500 }} onClick={() => setProfileModal(master)}>Портфоліо & деталі →</button>
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 20, padding: "12px 0 8px", background: C.white, borderTop: `1px solid ${C.border}` }}>
            <button className="abtn" style={{ width: 56, height: 56, background: C.white, border: `2px solid #FFB3B3`, borderRadius: "50%", color: "#E05555", fontSize: 22, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 16px rgba(224,85,85,0.15)" }} onClick={() => swipe("left")}>✕</button>
            <button className="abtn" style={{ width: 72, height: 72, background: `linear-gradient(135deg, ${C.pink}, ${C.pinkDark})`, border: "none", borderRadius: "50%", color: C.white, fontSize: 30, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 8px 28px ${C.pink}66` }} onClick={() => swipe("right")}>♥</button>
            <button className="abtn" style={{ width: 56, height: 56, background: C.white, border: `2px solid ${C.goldLight}`, borderRadius: "50%", color: C.goldMid, fontSize: 22, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 4px 16px ${C.gold}25` }} onClick={() => setProfileModal(master)}>★</button>
          </div>
        </div>
      )}

      {/* MATCHES */}
      {screen === "matches" && (
        <div style={S.screen}>
          <div style={{ padding: "20px 20px 14px", background: C.white, borderBottom: `1px solid ${C.border}` }}>
            <p style={{ color: C.textLight, fontSize: 10, fontWeight: 600, letterSpacing: "1.5px", textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif", marginBottom: 2 }}>{matches.length} матчів</p>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 700, color: C.text }}>Мої матчі</h1>
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: "0 0 90px" }}>
            {matches.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 32px", color: C.textLight, fontFamily: "'DM Sans', sans-serif" }}>
                <div style={{ fontSize: 56, marginBottom: 16 }}>💔</div>
                <p style={{ fontSize: 18, fontWeight: 600, color: C.textMid, marginBottom: 8 }}>Поки що немає матчів</p>
                <p style={{ fontSize: 14 }}>Свайпай майстрів щоб отримати матч!</p>
              </div>
            ) : (
              <>
                <div style={{ padding: "16px 20px 8px" }}>
                  <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 600, color: C.text, marginBottom: 12 }}>Нові ✨</p>
                  <div style={{ display: "flex", gap: 14, overflowX: "auto", paddingBottom: 8 }}>
                    {matches.slice(-5).map(m => (
                      <div key={m.id} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, cursor: "pointer", flexShrink: 0 }} onClick={() => { setActiveChat(m.id); setScreen("chat"); }}>
                        <div style={{ width: 64, height: 64, borderRadius: "50%", overflow: "hidden", border: `2.5px solid ${C.pink}` }}>
                          <img src={m.avatar_url} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="" />
                        </div>
                        <p style={{ color: C.textMid, fontSize: 11, fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}>{m.name.split(" ")[0]}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ padding: "0 20px" }}>
                  <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 600, color: C.text, marginBottom: 12, marginTop: 8 }}>Всі майстри</p>
                  {matches.map(m => (
                    <div key={m.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px", background: C.white, borderRadius: 16, marginBottom: 10, cursor: "pointer", border: `1px solid ${C.border}`, boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }} onClick={() => setProfileModal(m)}>
                      <div style={{ position: "relative", flexShrink: 0 }}>
                        <img src={m.avatar_url} style={{ width: 54, height: 54, borderRadius: "50%", objectFit: "cover" }} alt="" />
                        <div style={{ position: "absolute", bottom: 2, right: 2, width: 12, height: 12, borderRadius: "50%", background: C.green, border: `2px solid ${C.white}` }} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span style={{ color: C.text, fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 15 }}>{m.name}</span>
                          {(m.is_verified || m.verified) && <span style={{ background: `linear-gradient(135deg, ${C.gold}, ${C.goldMid})`, color: C.white, borderRadius: "50%", width: 18, height: 18, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700 }}>✓</span>}
                        </div>
                        <p style={{ color: C.pinkDark, fontFamily: "'DM Sans', sans-serif", fontSize: 12, marginTop: 2 }}>{m.specialty}</p>
                        <p style={{ color: C.textLight, fontSize: 11, fontFamily: "'DM Sans', sans-serif", marginTop: 2 }}>⭐ {m.rating} · 📍 {m.distance} · {m.price}</p>
                      </div>
                      <button style={{ background: C.pinkLight, border: "none", borderRadius: 12, width: 40, height: 40, cursor: "pointer", fontSize: 17, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }} onClick={e => { e.stopPropagation(); setActiveChat(m.id); setScreen("chat"); }}>💬</button>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* CHAT */}
      {screen === "chat" && (
        <div style={S.screen}>
          {!activeChat ? (
            <>
              <div style={{ padding: "20px 20px 14px", background: C.white, borderBottom: `1px solid ${C.border}` }}>
                <p style={{ color: C.textLight, fontSize: 10, fontWeight: 600, letterSpacing: "1.5px", textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif", marginBottom: 2 }}>{matches.length} переписок</p>
                <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 700, color: C.text }}>Повідомлення</h1>
              </div>
              <div style={{ flex: 1, overflowY: "auto", padding: "12px 20px 90px" }}>
                {matches.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "60px 20px", color: C.textLight, fontFamily: "'DM Sans', sans-serif" }}>
                    <div style={{ fontSize: 56, marginBottom: 16 }}>✉️</div>
                    <p style={{ fontSize: 18, fontWeight: 600, color: C.textMid, marginBottom: 8 }}>Немає повідомлень</p>
                    <p style={{ fontSize: 14 }}>Зматчись з майстром щоб написати!</p>
                  </div>
                ) : matches.map(m => {
                  const msgs = messages[m.id] || [];
                  const last = msgs[msgs.length - 1];
                  return (
                    <div key={m.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px", background: C.white, borderRadius: 16, marginBottom: 10, cursor: "pointer", border: `1px solid ${C.border}`, boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }} onClick={() => setActiveChat(m.id)}>
                      <div style={{ position: "relative", flexShrink: 0 }}>
                        <img src={m.avatar_url} style={{ width: 54, height: 54, borderRadius: "50%", objectFit: "cover" }} alt="" />
                        <div style={{ position: "absolute", bottom: 2, right: 2, width: 12, height: 12, borderRadius: "50%", background: C.green, border: `2px solid ${C.white}` }} />
                      </div>
                      <div style={{ flex: 1, overflow: "hidden" }}>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <span style={{ color: C.text, fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 15 }}>{m.name}</span>
                          <span style={{ color: C.textLight, fontSize: 11, fontFamily: "'DM Sans', sans-serif" }}>{last?.time}</span>
                        </div>
                        <p style={{ color: C.textMid, fontSize: 13, fontFamily: "'DM Sans', sans-serif", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{last?.text || "Почніть розмову!"}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", height: "100%", background: C.bg }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderBottom: `1px solid ${C.border}`, background: C.white, flexShrink: 0 }}>
                <button style={{ background: C.pinkLight, border: "none", borderRadius: 10, width: 36, height: 36, color: C.pinkDark, fontSize: 20, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }} onClick={() => setActiveChat(null)}>‹</button>
                <img src={activeChatMaster?.avatar_url} style={{ width: 42, height: 42, borderRadius: "50%", objectFit: "cover", border: `2px solid ${C.pink}` }} alt="" />
                <div style={{ flex: 1 }}>
                  <p style={{ color: C.text, fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 15 }}>{activeChatMaster?.name}</p>
                  <p style={{ color: C.green, fontSize: 11, fontFamily: "'DM Sans', sans-serif" }}>● Онлайн</p>
                </div>
                <button style={{ background: C.goldLight, border: "none", borderRadius: 10, width: 36, height: 36, fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }} onClick={() => setProfileModal(activeChatMaster)}>👤</button>
              </div>
              <div style={{ flex: 1, overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: 2 }}>
                {activeChatMessages.length === 0 && <div style={{ textAlign: "center", color: C.textLight, fontFamily: "'DM Sans', sans-serif", fontSize: 13, padding: "20px 0" }}>Почніть розмову 👋</div>}
                {activeChatMessages.map((msg, i) => (
                  <div key={msg.id || i} style={{ display: "flex", justifyContent: msg.from === "user" ? "flex-end" : "flex-start", marginBottom: 8, alignItems: "flex-end", gap: 8 }}>
                    {msg.from === "master" && <img src={activeChatMaster?.avatar_url} style={{ width: 30, height: 30, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} alt="" />}
                    <div style={{ maxWidth: "72%" }}>
                      <div style={{ background: msg.from === "user" ? `linear-gradient(135deg, ${C.pink}, ${C.pinkDark})` : C.white, borderRadius: msg.from === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px", padding: "10px 14px", boxShadow: msg.from === "user" ? `0 4px 12px ${C.pink}44` : "0 2px 8px rgba(0,0,0,0.06)", border: msg.from === "master" ? `1px solid ${C.border}` : "none" }}>
                        <p style={{ color: msg.from === "user" ? C.white : C.text, fontSize: 14, fontFamily: "'DM Sans', sans-serif", lineHeight: 1.4 }}>{msg.text}</p>
                      </div>
                      <p style={{ color: C.textLight, fontSize: 10, fontFamily: "'DM Sans', sans-serif", marginTop: 4, textAlign: msg.from === "user" ? "right" : "left" }}>{msg.time}</p>
                    </div>
                  </div>
                ))}
                <div ref={msgEnd} />
              </div>
              <div style={{ display: "flex", gap: 10, padding: "12px 16px", background: C.white, borderTop: `1px solid ${C.border}`, flexShrink: 0 }}>
                <input style={{ background: C.bg, border: `1.5px solid ${C.border}`, borderRadius: 24, padding: "11px 18px", color: C.text, fontFamily: "'DM Sans', sans-serif", fontSize: 14, outline: "none", flex: 1 }} placeholder="Написати повідомлення…" value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === "Enter" && sendMsg()} />
                <button style={{ background: `linear-gradient(135deg, ${C.pink}, ${C.pinkDark})`, border: "none", borderRadius: "50%", width: 44, height: 44, cursor: "pointer", color: C.white, fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: `0 4px 12px ${C.pink}55` }} onClick={sendMsg}>➤</button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* PROFILE */}
      {screen === "profile" && (
        <div style={S.screen}>
          <div style={{ padding: "20px 20px 14px", background: C.white, borderBottom: `1px solid ${C.border}` }}>
            <p style={{ color: C.textLight, fontSize: 10, fontWeight: 600, letterSpacing: "1.5px", textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif", marginBottom: 2 }}>Мій кабінет</p>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 700, color: C.text }}>Профіль</h1>
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: "20px 20px 90px" }}>
            <div style={{ background: `linear-gradient(135deg, ${C.pinkLight}, ${C.goldLight})`, borderRadius: 20, padding: "24px 20px", textAlign: "center", border: `1px solid ${C.border}`, display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 20 }}>
              <img src={user?.user_metadata?.avatar_url || "https://i.pravatar.cc/100?img=9"} style={{ width: 80, height: 80, borderRadius: "50%", objectFit: "cover", border: `3px solid ${C.pink}`, marginBottom: 12, boxShadow: `0 4px 16px ${C.pink}44` }} alt="" />
              <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: C.text }}>{user?.user_metadata?.name || "Користувач"}</p>
              <p style={{ color: C.textMid, fontFamily: "'DM Sans', sans-serif", fontSize: 13, marginTop: 4, marginBottom: 16 }}>{user?.email}</p>
              <div style={{ display: "flex", gap: 10, width: "100%" }}>
                {[{ n: likedIds.length, l: "Лайків", c: C.pinkDark }, { n: matches.length, l: "Матчів", c: C.goldMid }, { n: matches.length, l: "Чатів", c: C.pinkDark }].map(({ n, l, c }) => (
                  <div key={l} style={{ flex: 1, background: C.white, borderRadius: 14, padding: "12px 0", textAlign: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
                    <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 700, color: c }}>{n}</p>
                    <p style={{ color: C.textLight, fontSize: 11, fontFamily: "'DM Sans', sans-serif" }}>{l}</p>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: C.white, borderRadius: 14, padding: "12px 16px", border: `1px solid ${C.border}`, marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: C.green, flexShrink: 0 }} />
              <p style={{ color: C.green, fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600 }}>Підключено до Supabase · Realtime</p>
            </div>

            <button onClick={signOut} style={{ width: "100%", padding: "13px", background: C.white, border: "1.5px solid #FFB3B3", borderRadius: 14, color: "#E05555", fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600, cursor: "pointer", marginBottom: 24 }}>Вийти з акаунту</button>

            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: C.text, marginBottom: 14 }}>Дорожня карта 🚀</p>
            {[{ e: "🏪", t: "Салони краси", d: "Топові салони міста — скоро" }, { e: "📅", t: "Онлайн-запис", d: "Резервуйте час прямо в застосунку" }, { e: "⚡", t: "Просування майстрів", d: "Вихід у топ за підпискою" }, { e: "🎯", t: "Реклама брендів", d: "Нативна інтеграція косметичних брендів" }, { e: "📊", t: "Beauty Pulse", d: "Аналітика та інсайти для майстрів" }].map(({ e, t, d }) => (
              <div key={t} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", background: C.white, borderRadius: 14, marginBottom: 8, border: `1px solid ${C.border}` }}>
                <span style={{ fontSize: 22, width: 36, textAlign: "center" }}>{e}</span>
                <div style={{ flex: 1 }}>
                  <p style={{ color: C.text, fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600 }}>{t}</p>
                  <p style={{ color: C.textLight, fontFamily: "'DM Sans', sans-serif", fontSize: 12, marginTop: 2 }}>{d}</p>
                </div>
                <div style={{ background: C.goldLight, border: `1px solid ${C.gold}44`, borderRadius: 10, padding: "3px 10px", color: C.goldMid, fontSize: 11, fontFamily: "'DM Sans', sans-serif", fontWeight: 700 }}>Soon</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* NAV */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 72, background: C.white, borderTop: `1px solid ${C.border}`, display: "flex", justifyContent: "space-around", alignItems: "center" }}>
        {[{ id: "discover", icon: "✦", label: "Пошук" }, { id: "matches", icon: "♥", label: "Матчі", n: matches.length }, { id: "chat", icon: "✉", label: "Чат", n: matches.length }, { id: "profile", icon: "◎", label: "Профіль" }].map(t => (
          <button key={t.id} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, background: "none", border: "none", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", color: screen === t.id ? C.pinkDark : C.textLight, position: "relative", padding: "8px 16px" }} onClick={() => { setScreen(t.id); if (t.id !== "chat") setActiveChat(null); }}>
            {screen === t.id && <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: 24, height: 3, borderRadius: 2, background: `linear-gradient(90deg, ${C.pink}, ${C.pinkDark})` }} />}
            <span style={{ fontSize: 20, lineHeight: 1 }}>{t.icon}</span>
            <span style={{ fontSize: 10, fontWeight: screen === t.id ? 700 : 500, letterSpacing: "0.3px" }}>{t.label}</span>
            {t.n > 0 && screen !== t.id && <div style={{ position: "absolute", top: 4, right: 8, background: `linear-gradient(135deg, ${C.pink}, ${C.pinkDark})`, borderRadius: "50%", width: 16, height: 16, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, color: C.white, fontWeight: 700 }}>{t.n}</div>}
          </button>
        ))}
      </div>
    </div>
  );
}

const S = {
  app: { width: "100%", maxWidth: 430, margin: "0 auto", height: "100vh", display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" },
  screen: { flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", paddingBottom: 72 },
  overlay: { position: "absolute", inset: 0, background: "rgba(42,32,37,0.5)", zIndex: 100, display: "flex", alignItems: "flex-end", justifyContent: "center", backdropFilter: "blur(8px)" },
};

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent}
  ::-webkit-scrollbar{width:0}
  .abtn{transition:all 0.2s cubic-bezier(.34,1.56,.64,1)}
  .abtn:hover{transform:scale(1.08)}
  .abtn:active{transform:scale(0.94)}
  .card-in{animation:cardIn 0.38s cubic-bezier(.34,1.56,.64,1)}
  @keyframes cardIn{from{opacity:0;transform:scale(0.94) translateY(16px)}to{opacity:1;transform:scale(1) translateY(0)}}
  .go-right{animation:goRight 0.34s ease-in forwards}
  .go-left{animation:goLeft 0.34s ease-in forwards}
  @keyframes goRight{to{transform:translateX(120%) rotate(15deg);opacity:0}}
  @keyframes goLeft{to{transform:translateX(-120%) rotate(-15deg);opacity:0}}
  .pop{animation:pop 0.4s cubic-bezier(.34,1.56,.64,1)}
  @keyframes pop{from{transform:scale(0.8) translateY(20px);opacity:0}to{transform:scale(1) translateY(0);opacity:1}}
  .stamp-like{position:absolute;top:24px;left:18px;border:3px solid #4CAF82;color:#4CAF82;border-radius:8px;padding:4px 12px;font-family:'Playfair Display',serif;font-weight:700;font-size:24px;letter-spacing:2px;transform:rotate(-12deg);opacity:0;transition:opacity 0.12s;z-index:10;background:rgba(255,255,255,0.9)}
  .stamp-nope{position:absolute;top:24px;right:18px;border:3px solid #E05555;color:#E05555;border-radius:8px;padding:4px 12px;font-family:'Playfair Display',serif;font-weight:700;font-size:24px;letter-spacing:2px;transform:rotate(12deg);opacity:0;transition:opacity 0.12s;z-index:10;background:rgba(255,255,255,0.9)}
  .show-stamp{opacity:1!important}
`;
