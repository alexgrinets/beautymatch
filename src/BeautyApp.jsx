import { useState, useRef, useEffect } from "react";
import { supabase } from "./supabaseClient";

const STATIC_MASTERS = [
  {
    id: 1, name: "Аліна Соколова", specialty: "Бровіст & Візажист",
    rating: 4.9, reviews_count: 312, distance: "0.8 км", price_from: 800,
    tags: ["Брови", "Макіяж", "Ламінування"],
    availability: "Сьогодні вільна",
    bio: "7 років досвіду. Спеціалізуюсь на натуральному макіяжі та архітектурі брів. Сертифікована майстриня LVIV Beauty School.",
    avatar_url: "https://i.pravatar.cc/300?img=47",
    portfolio_urls: [
      "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1519415943484-9fa1873496d4?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=400&h=500&fit=crop",
    ],
    is_verified: true, address: "вул. Хрещатик, 14", is_promoted: true,
  },
  {
    id: 2, name: "Оксана Лисенко", specialty: "Нейл-майстер",
    rating: 4.8, reviews_count: 198, distance: "1.2 км", price_from: 550,
    tags: ["Манікюр", "Педикюр", "Гель-лак", "Нарощування"],
    availability: "Завтра з 10:00",
    bio: "Nail-art майстриня. Люблю мінімалізм і складний дизайн. Використовую тільки преміум матеріали.",
    avatar_url: "https://i.pravatar.cc/300?img=45",
    portfolio_urls: [
      "https://images.unsplash.com/photo-1604654894610-df63bc536fac?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1604654894533-1c5a9c4c5e49?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1604654894568-9ff3bdf3b5da?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1604655406337-96d2b8c0f1dc?w=400&h=500&fit=crop",
    ],
    is_verified: true, address: "вул. Саксаганського, 32", is_promoted: false,
  },
  {
    id: 3, name: "Марина Дорошенко", specialty: "Перукар-стиліст",
    rating: 4.95, reviews_count: 421, distance: "2.1 км", price_from: 1200,
    tags: ["Стрижка", "Фарбування", "Кератин", "Укладка"],
    availability: "Сьогодні з 15:00",
    bio: "Топ-майстер міста. 12 років у сфері. Спеціаліст з корекції кольору та складного фарбування.",
    avatar_url: "https://i.pravatar.cc/300?img=44",
    portfolio_urls: [
      "https://images.unsplash.com/photo-1560869713-da86a9ec0744?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=400&h=500&fit=crop",
    ],
    is_verified: true, address: "вул. Велика Васильківська, 77", is_promoted: false,
  },
  {
    id: 4, name: "Катерина Іванова", specialty: "Лешмейкер",
    rating: 4.7, reviews_count: 156, distance: "0.5 км", price_from: 700,
    tags: ["Нарощування вій", "Ламінування вій", "Біозавивка"],
    availability: "Сьогодні вільна",
    bio: "Ніжний погляд — моя справа. Навчалась у Кореї. Гарантую якість і натуральність.",
    avatar_url: "https://i.pravatar.cc/300?img=43",
    portfolio_urls: [
      "https://images.unsplash.com/photo-1583001809873-a128495da465?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1574169208507-84376144848b?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400&h=500&fit=crop",
    ],
    is_verified: false, address: "пр. Перемоги, 5", is_promoted: false,
  },
  {
    id: 5, name: "Юлія Момот", specialty: "Косметолог",
    rating: 4.9, reviews_count: 287, distance: "3.0 км", price_from: 1500,
    tags: ["Чищення", "Пілінг", "Мезотерапія"],
    availability: "Завтра з 9:00",
    bio: "Лікар-дерматолог з медичною освітою. Комплексний догляд за шкірою. Апаратна косметологія.",
    avatar_url: "https://i.pravatar.cc/300?img=48",
    portfolio_urls: [
      "https://images.unsplash.com/photo-1619451050621-83cb7aada2d7?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1532413992378-f169ac26fff0?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=400&h=500&fit=crop",
    ],
    is_verified: true, address: "вул. Золотоворітська, 2", is_promoted: true,
  },
];

// Нормалізація даних з БД до формату застосунку
const normalizeMaster = (m) => ({
  ...m,
  // сумісність зі старими полями
  avatar: m.avatar_url,
  portfolio: m.portfolio_urls || [],
  verified: m.is_verified,
  promoted: m.is_promoted,
  rating: parseFloat(m.rating) || 5.0,
  reviews: m.reviews_count || 0,
  distance: m.distance || "—",
  price: m.price_from ? `від ${m.price_from} ₴` : "—",
});

const CATEGORIES = ["Всі", "Брови", "Нігті", "Волосся", "Вії", "Косметологія", "Макіяж"];

export default function BeautyApp() {
  const [masters, setMasters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dbConnected, setDbConnected] = useState(false);
  const [screen, setScreen] = useState("discover");
  const [cardIndex, setCardIndex] = useState(0);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [likedIds, setLikedIds] = useState([]);
  const [matches, setMatches] = useState([]);
  const [chats, setChats] = useState({});
  const [activeChat, setActiveChat] = useState(null);
  const [chatInput, setChatInput] = useState("");
  const [swipeAnim, setSwipeAnim] = useState(null);
  const [matchOverlay, setMatchOverlay] = useState(null);
  const [profileModal, setProfileModal] = useState(null);
  const [activeCategory, setActiveCategory] = useState("Всі");
  const msgEnd = useRef(null);

  // Завантаження майстрів із Supabase
  useEffect(() => {
    const loadMasters = async () => {
      try {
        const { data, error } = await supabase
          .from("masters")
          .select("*")
          .order("is_promoted", { ascending: false })
          .order("rating", { ascending: false });

        if (error) throw error;

        if (data && data.length > 0) {
          setMasters(data.map(normalizeMaster));
          setDbConnected(true);
          console.log(`✅ Завантажено ${data.length} майстрів з Supabase`);
        } else {
          // Немає даних в БД — використовуємо статичні
          setMasters(STATIC_MASTERS.map(normalizeMaster));
          console.log("ℹ️ Supabase порожній — використовуємо демо-дані");
        }
      } catch (err) {
        console.error("❌ Помилка Supabase:", err.message);
        setMasters(STATIC_MASTERS.map(normalizeMaster));
      } finally {
        setLoading(false);
      }
    };

    loadMasters();
  }, []);

  // Ініціалізація першого матчу після завантаження
  useEffect(() => {
    if (masters.length > 0 && matches.length === 0) {
      const first = masters[0];
      setMatches([first]);
      setChats({
        [first.id]: {
          master: first,
          messages: [{ from: "master", text: `Привіт! Рада, що ми зматчились 💕 Чим можу допомогти?`, time: "10:31" }]
        }
      });
    }
  }, [masters]);

  useEffect(() => { msgEnd.current?.scrollIntoView({ behavior: "smooth" }); }, [chats, activeChat]);

  const master = masters[cardIndex % (masters.length || 1)];

  const swipe = async (dir) => {
    if (!master) return;
    setSwipeAnim(dir);
    setTimeout(async () => {
      setSwipeAnim(null);
      setPhotoIndex(0);
      if (dir === "right") {
        setLikedIds(p => [...p, master.id]);
        if (!matches.find(m => m.id === master.id)) {
          setMatches(p => [...p, master]);
          setChats(p => ({
            ...p,
            [master.id]: {
              master,
              messages: [{ from: "master", text: `Привіт! Я ${master.name} ✨ Рада нашому матчу!`, time: now() }]
            }
          }));
          setMatchOverlay(master);

          // Зберігаємо лайк у Supabase (якщо підключено)
          if (dbConnected) {
            await supabase.from("likes").upsert({
              from_user: "00000000-0000-0000-0000-000000000001", // тимчасовий guest ID
              to_master: master.id,
            });
          }
        }
      }
      setCardIndex(p => p + 1);
    }, 340);
  };

  const sendMsg = () => {
    if (!chatInput.trim() || !activeChat) return;
    const txt = chatInput; setChatInput("");
    setChats(p => ({ ...p, [activeChat]: { ...p[activeChat], messages: [...p[activeChat].messages, { from: "user", text: txt, time: now() }] } }));
    const replies = ["Звісно! 😊", "Гарний вибір! 💅", "Так, цей час вільний!", "Напишіть коли зручно ✨", "Дякую! Чекаю вас 💕"];
    setTimeout(() => {
      setChats(p => ({ ...p, [activeChat]: { ...p[activeChat], messages: [...p[activeChat].messages, { from: "master", text: replies[Math.floor(Math.random() * replies.length)], time: now() }] } }));
    }, 1000);
  };

  if (loading) {
    return (
      <div style={{ ...S.app, alignItems: "center", justifyContent: "center", gap: 16 }}>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 32, color: "#f0e6dc", fontWeight: 300 }}>BeautyMatch</div>
        <div style={{ width: 36, height: 36, borderRadius: "50%", border: "2px solid rgba(212,160,123,0.2)", borderTop: "2px solid #d4a07b", animation: "spin 0.9s linear infinite" }} />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        <p style={{ color: "rgba(255,255,255,0.3)", fontFamily: "'DM Sans'", fontSize: 13 }}>Завантаження майстрів…</p>
      </div>
    );
  }

  return (
    <div style={S.app}>
      <style>{CSS}</style>

      {/* DB статус індикатор */}
      {dbConnected && (
        <div style={{ position: "absolute", top: 8, right: 8, zIndex: 200, background: "rgba(78,203,113,0.1)", border: "1px solid rgba(78,203,113,0.3)", borderRadius: 10, padding: "2px 8px", display: "flex", alignItems: "center", gap: 4 }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ecb71" }} />
          <span style={{ color: "#4ecb71", fontSize: 9, fontFamily: "'DM Sans'", fontWeight: 600 }}>LIVE</span>
        </div>
      )}

      {/* MATCH OVERLAY */}
      {matchOverlay && (
        <div style={S.overlay}>
          <div style={S.matchBox} className="pop">
            <div style={S.matchGlow} />
            <p style={S.matchTitle}>✨ Це матч!</p>
            <div style={S.matchAvas}>
              <img src="https://i.pravatar.cc/100?img=9" style={S.matchAva} alt="" />
              <span style={{ fontSize: 30, animation: "pulse 1.4s infinite" }}>💖</span>
              <img src={matchOverlay.avatar_url || matchOverlay.avatar} style={S.matchAva} alt="" />
            </div>
            <p style={S.matchName}>{matchOverlay.name}</p>
            <p style={S.matchSpec}>{matchOverlay.specialty}</p>
            <button style={S.matchBtn} onClick={() => { setMatchOverlay(null); setActiveChat(matchOverlay.id); setScreen("chat"); }}>Написати зараз</button>
            <button style={S.matchSkip} onClick={() => setMatchOverlay(null)}>Пізніше</button>
          </div>
        </div>
      )}

      {/* PROFILE MODAL */}
      {profileModal && (
        <div style={S.overlay} onClick={() => setProfileModal(null)}>
          <div style={S.modal} onClick={e => e.stopPropagation()}>
            <button style={S.modalX} onClick={() => setProfileModal(null)}>✕</button>
            <div style={S.modalInner}>
              <img src={(profileModal.portfolio_urls || profileModal.portfolio)?.[0]} style={S.modalCover} alt="" />
              <div style={S.modalBody}>
                <div style={S.modalHead}>
                  <img src={profileModal.avatar_url || profileModal.avatar} style={S.modalAva} alt="" />
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                      <span style={S.modalName}>{profileModal.name}</span>
                      {(profileModal.is_verified || profileModal.verified) && <span style={S.badge}>✓</span>}
                    </div>
                    <p style={S.modalSpec}>{profileModal.specialty}</p>
                    <p style={S.modalMeta}>⭐ {profileModal.rating} · 📍 {profileModal.distance} · {profileModal.price || `від ${profileModal.price_from} ₴`}</p>
                  </div>
                </div>
                <p style={S.modalBio}>{profileModal.bio}</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 18 }}>
                  {(profileModal.tags || []).map(t => <span key={t} className="tag">{t}</span>)}
                </div>
                <p style={S.portTitle}>Портфоліо</p>
                <div style={S.portGrid}>
                  {(profileModal.portfolio_urls || profileModal.portfolio || []).map((src, i) => <img key={i} src={src} style={S.portThumb} alt="" />)}
                </div>
                <p style={S.modalMeta}>📍 {profileModal.address}</p>
                {profileModal.availability && (
                  <div style={{ display: "flex", alignItems: "center", gap: 7, marginTop: 10 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#4ecb71" }} />
                    <span style={{ color: "rgba(255,255,255,0.7)", fontFamily: "'DM Sans'", fontSize: 13 }}>{profileModal.availability}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── DISCOVER ─── */}
      {screen === "discover" && master && (
        <div style={S.screen}>
          <div style={S.header}>
            <div>
              <p style={S.headerSub}>Київ · 5 км</p>
              <h1 style={S.logo}>BeautyMatch</h1>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button style={S.iconBtn}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(212,160,123,0.8)" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              </button>
              <button style={S.iconBtn}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(212,160,123,0.8)" strokeWidth="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
              </button>
            </div>
          </div>

          <div style={S.cats}>
            {CATEGORIES.map(c => (
              <button key={c} className="pill"
                style={{ background: activeCategory === c ? "linear-gradient(135deg,#d4a07b,#c4855a)" : "rgba(255,255,255,0.05)", color: activeCategory === c ? "#fff" : "rgba(255,255,255,0.45)", border: activeCategory === c ? "none" : "1px solid rgba(255,255,255,0.08)" }}
                onClick={() => setActiveCategory(c)}>{c}</button>
            ))}
          </div>

          <div style={S.cardWrap}>
            <div key={cardIndex} className={`card-in ${swipeAnim === "right" ? "go-right" : swipeAnim === "left" ? "go-left" : ""}`} style={S.card}>
              {(master.is_promoted || master.promoted) && <div style={S.promo}>⚡ Топ майстер</div>}
              <div className={`stamp-like ${swipeAnim === "right" ? "show-stamp" : ""}`}>ЛАЙК</div>
              <div className={`stamp-nope ${swipeAnim === "left" ? "show-stamp" : ""}`}>ПРОПУСК</div>

              <div style={{ position: "relative", height: 460 }}>
                <img src={(master.portfolio_urls || master.portfolio)?.[photoIndex]} style={S.photo} alt="" />
                <div style={S.dots}>
                  {(master.portfolio_urls || master.portfolio || []).map((_, i) => <div key={i} onClick={() => setPhotoIndex(i)} style={{ ...S.dot, background: i === photoIndex ? "#d4a07b" : "rgba(255,255,255,0.35)", cursor: "pointer" }} />)}
                </div>
                <div style={{ position: "absolute", top: 0, left: 0, width: "40%", height: "100%", zIndex: 4 }} onClick={() => setPhotoIndex(Math.max(0, photoIndex - 1))} />
                <div style={{ position: "absolute", top: 0, right: 0, width: "40%", height: "100%", zIndex: 4 }} onClick={() => setPhotoIndex(((master.portfolio_urls || master.portfolio || []).length - 1 + photoIndex + 1) % Math.max(1, (master.portfolio_urls || master.portfolio || []).length))} />
                <div style={S.grad} />
                <div style={S.info}>
                  <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 2 }}>
                    <span style={S.cName}>{master.name}</span>
                    {(master.is_verified || master.verified) && <span style={S.badge}>✓</span>}
                  </div>
                  <p style={S.cSpec}>{master.specialty}</p>
                  <div style={{ display: "flex", gap: 7, marginBottom: 8 }}>
                    {["⭐ " + master.rating, "📍 " + master.distance, "💳 " + (master.price || `від ${master.price_from} ₴`)].map(v => <span key={v} style={S.chip}>{v}</span>)}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
                    <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#4ecb71" }} />
                    <span style={{ color: "rgba(255,255,255,0.8)", fontSize: 12, fontFamily: "'DM Sans'" }}>{master.availability}</span>
                  </div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
                    {(master.tags || []).slice(0, 3).map(t => <span key={t} className="tag">{t}</span>)}
                  </div>
                  <button style={S.moreBtn} onClick={() => setProfileModal(master)}>Портфоліо & деталі →</button>
                </div>
              </div>
            </div>
          </div>

          <div style={S.btns}>
            <button className="abtn" style={{ width: 54, height: 54, background: "rgba(255,77,109,0.12)", border: "2px solid rgba(255,77,109,0.35)", color: "#ff4d6d", fontSize: 22 }} onClick={() => swipe("left")}>✕</button>
            <button className="abtn" style={{ width: 68, height: 68, background: "linear-gradient(135deg,#d4a07b,#c4855a)", boxShadow: "0 8px 30px rgba(212,160,123,0.4)", color: "#fff", fontSize: 28 }} onClick={() => swipe("right")}>♥</button>
            <button className="abtn" style={{ width: 54, height: 54, background: "rgba(78,203,113,0.12)", border: "2px solid rgba(78,203,113,0.35)", color: "#4ecb71", fontSize: 20 }} onClick={() => setProfileModal(master)}>★</button>
          </div>
        </div>
      )}

      {/* ─── MATCHES ─── */}
      {screen === "matches" && (
        <div style={S.screen}>
          <div style={S.header}>
            <div><p style={S.headerSub}>{matches.length} матчів</p><h1 style={S.logo}>Мої матчі</h1></div>
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: "0 20px 90px" }}>
            <p style={S.sec}>Нові ✨</p>
            <div style={{ display: "flex", gap: 14, overflowX: "auto", paddingBottom: 10 }}>
              {matches.slice(-5).map(m => (
                <div key={m.id} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, cursor: "pointer" }} onClick={() => { setActiveChat(m.id); setScreen("chat"); }}>
                  <div style={{ width: 66, height: 66, borderRadius: "50%", overflow: "hidden", border: "2.5px solid rgba(212,160,123,0.5)", flexShrink: 0 }}>
                    <img src={m.avatar_url || m.avatar} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="" />
                  </div>
                  <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 11, fontFamily: "'DM Sans'" }}>{m.name.split(" ")[0]}</p>
                </div>
              ))}
            </div>
            <p style={{ ...S.sec, marginTop: 22 }}>Всі майстри</p>
            {matches.map(m => (
              <div key={m.id} style={S.listItem} onClick={() => setProfileModal(m)}>
                <div style={{ position: "relative", flexShrink: 0 }}>
                  <img src={m.avatar_url || m.avatar} style={{ width: 52, height: 52, borderRadius: "50%", objectFit: "cover" }} alt="" />
                  <div style={S.online} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={S.ln}>{m.name}</span>
                    {(m.is_verified || m.verified) && <span style={S.badge}>✓</span>}
                  </div>
                  <p style={S.ls}>{m.specialty}</p>
                  <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 11, fontFamily: "'DM Sans'", marginTop: 2 }}>⭐ {m.rating} · 📍 {m.distance} · {m.price || `від ${m.price_from} ₴`}</p>
                </div>
                <button style={S.chatBubble} onClick={e => { e.stopPropagation(); setActiveChat(m.id); setScreen("chat"); }}>💬</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── CHAT ─── */}
      {screen === "chat" && (
        <div style={S.screen}>
          {!activeChat ? (
            <>
              <div style={S.header}>
                <div><p style={S.headerSub}>{Object.keys(chats).length} переписок</p><h1 style={S.logo}>Повідомлення</h1></div>
              </div>
              <div style={{ flex: 1, overflowY: "auto", padding: "0 20px 90px" }}>
                {Object.values(chats).map(({ master: m, messages: msgs }) => {
                  const last = msgs[msgs.length - 1];
                  return (
                    <div key={m.id} style={S.listItem} onClick={() => setActiveChat(m.id)}>
                      <div style={{ position: "relative", flexShrink: 0 }}>
                        <img src={m.avatar_url || m.avatar} style={{ width: 52, height: 52, borderRadius: "50%", objectFit: "cover" }} alt="" />
                        <div style={S.online} />
                      </div>
                      <div style={{ flex: 1, overflow: "hidden" }}>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <span style={S.ln}>{m.name}</span>
                          <span style={{ color: "rgba(255,255,255,0.25)", fontSize: 11, fontFamily: "'DM Sans'" }}>{last?.time}</span>
                        </div>
                        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, fontFamily: "'DM Sans'", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{last?.text}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
              <div style={S.chatHead}>
                <button style={{ background: "none", border: "none", color: "#d4a07b", fontSize: 24, cursor: "pointer" }} onClick={() => setActiveChat(null)}>‹</button>
                <img src={chats[activeChat]?.master.avatar_url || chats[activeChat]?.master.avatar} style={{ width: 40, height: 40, borderRadius: "50%", objectFit: "cover" }} alt="" />
                <div style={{ flex: 1 }}>
                  <p style={S.ln}>{chats[activeChat]?.master.name}</p>
                  <p style={{ color: "#4ecb71", fontSize: 11, fontFamily: "'DM Sans'" }}>● Онлайн</p>
                </div>
                <button style={{ background: "none", border: "none", fontSize: 18, cursor: "pointer" }} onClick={() => setProfileModal(chats[activeChat]?.master)}>👤</button>
              </div>
              <div style={S.msgs}>
                {chats[activeChat]?.messages.map((msg, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: msg.from === "user" ? "flex-end" : "flex-start", marginBottom: 10, alignItems: "flex-end", gap: 8 }}>
                    {msg.from === "master" && <img src={chats[activeChat]?.master.avatar_url || chats[activeChat]?.master.avatar} style={{ width: 28, height: 28, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} alt="" />}
                    <div style={{ maxWidth: "72%" }}>
                      <div style={{ background: msg.from === "user" ? "linear-gradient(135deg,#d4a07b,#c4855a)" : "rgba(255,255,255,0.07)", borderRadius: msg.from === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px", padding: "10px 14px" }}>
                        <p style={{ color: "#fff", fontSize: 14, fontFamily: "'DM Sans'", lineHeight: 1.4 }}>{msg.text}</p>
                      </div>
                      <p style={{ color: "rgba(255,255,255,0.22)", fontSize: 10, fontFamily: "'DM Sans'", marginTop: 3, textAlign: msg.from === "user" ? "right" : "left" }}>{msg.time}</p>
                    </div>
                  </div>
                ))}
                <div ref={msgEnd} />
              </div>
              <div style={S.chatIn}>
                <input className="minput" placeholder="Написати повідомлення…" value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === "Enter" && sendMsg()} />
                <button style={{ background: "linear-gradient(135deg,#d4a07b,#c4855a)", border: "none", borderRadius: "50%", width: 42, height: 42, cursor: "pointer", color: "#fff", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center" }} onClick={sendMsg}>➤</button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ─── PROFILE ─── */}
      {screen === "profile" && (
        <div style={S.screen}>
          <div style={S.header}><div><p style={S.headerSub}>Мій кабінет</p><h1 style={S.logo}>Профіль</h1></div></div>
          <div style={{ flex: 1, overflowY: "auto", padding: "0 20px 90px" }}>
            <div style={S.profileCard}>
              <img src="https://i.pravatar.cc/100?img=9" style={{ width: 80, height: 80, borderRadius: "50%", objectFit: "cover", border: "3px solid rgba(212,160,123,0.4)", marginBottom: 12 }} alt="" />
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, color: "#f0e6dc", fontWeight: 400 }}>Вікторія</p>
              <p style={{ color: "rgba(255,255,255,0.4)", fontFamily: "'DM Sans'", fontSize: 13, marginTop: 4 }}>📍 Київ · 5 км пошук</p>
              <div style={{ display: "flex", gap: 10, marginTop: 16, width: "100%" }}>
                {[{ n: likedIds.length, l: "Лайків" }, { n: matches.length, l: "Матчів" }, { n: Object.keys(chats).length, l: "Чатів" }].map(({ n, l }) => (
                  <div key={l} style={{ flex: 1, background: "rgba(255,255,255,0.04)", borderRadius: 12, padding: "12px 0", textAlign: "center" }}>
                    <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, color: "#d4a07b" }}>{n}</p>
                    <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 11, fontFamily: "'DM Sans'" }}>{l}</p>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 14, background: dbConnected ? "rgba(78,203,113,0.08)" : "rgba(255,255,255,0.04)", borderRadius: 10, padding: "8px 14px", border: `1px solid ${dbConnected ? "rgba(78,203,113,0.2)" : "rgba(255,255,255,0.06)"}`, width: "100%" }}>
                <p style={{ color: dbConnected ? "#4ecb71" : "rgba(255,255,255,0.3)", fontFamily: "'DM Sans'", fontSize: 12, textAlign: "center" }}>
                  {dbConnected ? "🟢 Підключено до Supabase" : "⚪ Демо-режим"}
                </p>
              </div>
            </div>

            <p style={{ ...S.sec, marginTop: 24 }}>Дорожня карта 🚀</p>
            {[
              { e: "🏪", t: "Салони краси", d: "Топові салони міста — скоро" },
              { e: "📅", t: "Онлайн-запис", d: "Резервуйте час прямо в застосунку" },
              { e: "⚡", t: "Просування майстрів", d: "Вихід у топ за підпискою" },
              { e: "🎯", t: "Реклама брендів", d: "Нативна інтеграція косметичних брендів" },
              { e: "📊", t: "Beauty Pulse", d: "Аналітика та інсайти для майстрів" },
            ].map(({ e, t, d }) => (
              <div key={t} style={S.roadItem}>
                <span style={{ fontSize: 22 }}>{e}</span>
                <div style={{ flex: 1 }}>
                  <p style={{ color: "#f0e6dc", fontFamily: "'DM Sans'", fontSize: 14, fontWeight: 500 }}>{t}</p>
                  <p style={{ color: "rgba(255,255,255,0.38)", fontFamily: "'DM Sans'", fontSize: 12, marginTop: 2 }}>{d}</p>
                </div>
                <div style={{ background: "rgba(212,160,123,0.1)", border: "1px solid rgba(212,160,123,0.2)", borderRadius: 10, padding: "3px 10px", color: "#d4a07b", fontSize: 11, fontFamily: "'DM Sans'", fontWeight: 600 }}>Soon</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── BOTTOM NAV ─── */}
      <div style={S.nav}>
        {[
          { id: "discover", icon: "✦", label: "Пошук" },
          { id: "matches", icon: "♥", label: "Матчі", n: matches.length },
          { id: "chat", icon: "✉", label: "Чат", n: Object.keys(chats).length },
          { id: "profile", icon: "◎", label: "Профіль" },
        ].map(t => (
          <button key={t.id} className="nav-btn" style={{ color: screen === t.id ? "#d4a07b" : "rgba(255,255,255,0.3)", position: "relative" }} onClick={() => { setScreen(t.id); if (t.id !== "chat") setActiveChat(null); }}>
            <span style={{ fontSize: 20, lineHeight: 1 }}>{t.icon}</span>
            <span style={{ fontSize: 10, fontWeight: 500, letterSpacing: "0.4px" }}>{t.label}</span>
            {t.n > 0 && screen !== t.id && <div style={S.badge2}>{t.n}</div>}
          </button>
        ))}
      </div>
    </div>
  );
}

const now = () => new Date().toLocaleTimeString("uk", { hour: "2-digit", minute: "2-digit" });

const S = {
  app: { width: "100%", maxWidth: 430, margin: "0 auto", height: "100vh", background: "#0d0b08", display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" },
  screen: { flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", paddingBottom: 70 },
  header: { display: "flex", justifyContent: "space-between", alignItems: "flex-end", padding: "16px 20px 10px" },
  headerSub: { color: "rgba(212,160,123,0.55)", fontSize: 10, fontWeight: 500, letterSpacing: "1px", textTransform: "uppercase", fontFamily: "'DM Sans'" },
  logo: { fontFamily: "'Cormorant Garamond', serif", fontSize: 30, fontWeight: 300, color: "#f0e6dc", letterSpacing: "0.5px", lineHeight: 1.1 },
  iconBtn: { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 11, width: 36, height: 36, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" },
  cats: { display: "flex", gap: 8, padding: "0 20px 12px", overflowX: "auto" },
  cardWrap: { flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 16px", overflow: "hidden" },
  card: { width: "100%", maxWidth: 390, borderRadius: 22, overflow: "hidden", background: "#1a1410", boxShadow: "0 20px 60px rgba(0,0,0,0.65), 0 0 0 1px rgba(255,255,255,0.04)", position: "relative" },
  promo: { position: "absolute", top: 14, right: 14, background: "linear-gradient(135deg,#d4a07b,#c4855a)", borderRadius: 18, padding: "3px 10px", fontSize: 10, fontWeight: 600, color: "#fff", zIndex: 5, fontFamily: "'DM Sans'" },
  photo: { width: "100%", height: "100%", objectFit: "cover", display: "block" },
  dots: { position: "absolute", top: 12, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 5, zIndex: 5 },
  dot: { height: 3, width: 28, borderRadius: 2, transition: "background 0.2s" },
  grad: { position: "absolute", bottom: 0, left: 0, right: 0, height: "73%", background: "linear-gradient(to top, rgba(8,6,4,0.97) 0%, rgba(8,6,4,0.65) 50%, transparent 100%)", zIndex: 3 },
  info: { position: "absolute", bottom: 0, left: 0, right: 0, padding: "18px 18px 16px", zIndex: 4 },
  cName: { fontFamily: "'Cormorant Garamond', serif", fontSize: 26, fontWeight: 400, color: "#f0e6dc" },
  cSpec: { color: "rgba(212,160,123,0.85)", fontSize: 12, fontFamily: "'DM Sans'", marginBottom: 8, marginTop: 1 },
  chip: { background: "rgba(255,255,255,0.08)", borderRadius: 11, padding: "3px 9px", fontSize: 11, color: "rgba(255,255,255,0.72)", fontFamily: "'DM Sans'" },
  moreBtn: { background: "none", border: "1px solid rgba(212,160,123,0.3)", color: "#d4a07b", borderRadius: 18, padding: "5px 14px", fontSize: 12, fontFamily: "'DM Sans'", cursor: "pointer", fontWeight: 500 },
  btns: { display: "flex", justifyContent: "center", alignItems: "center", gap: 22, padding: "12px 0 6px" },
  badge: { background: "linear-gradient(135deg,#d4a07b,#c4855a)", color: "#fff", borderRadius: "50%", width: 18, height: 18, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, flexShrink: 0 },
  badge2: { position: "absolute", top: -3, right: 4, background: "#d4a07b", borderRadius: "50%", width: 15, height: 15, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, color: "#fff", fontWeight: 700 },
  sec: { fontFamily: "'Cormorant Garamond', serif", fontSize: 20, color: "#f0e6dc", fontWeight: 300, marginBottom: 14 },
  listItem: { display: "flex", alignItems: "center", gap: 14, padding: "12px", background: "rgba(255,255,255,0.03)", borderRadius: 14, marginBottom: 10, cursor: "pointer", border: "1px solid rgba(255,255,255,0.04)" },
  online: { position: "absolute", bottom: 2, right: 2, width: 11, height: 11, borderRadius: "50%", background: "#4ecb71", border: "2px solid #0d0b08" },
  ln: { color: "#f0e6dc", fontFamily: "'DM Sans'", fontWeight: 500, fontSize: 14 },
  ls: { color: "rgba(212,160,123,0.7)", fontFamily: "'DM Sans'", fontSize: 12, marginTop: 2 },
  chatBubble: { background: "rgba(212,160,123,0.1)", border: "1px solid rgba(212,160,123,0.2)", borderRadius: 11, width: 38, height: 38, cursor: "pointer", fontSize: 17, display: "flex", alignItems: "center", justifyContent: "center" },
  chatHead: { display: "flex", alignItems: "center", gap: 12, padding: "10px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(8,6,4,0.9)", backdropFilter: "blur(12px)", flexShrink: 0 },
  msgs: { flex: 1, overflowY: "auto", padding: "14px 16px", display: "flex", flexDirection: "column" },
  chatIn: { display: "flex", gap: 10, padding: "10px 14px", background: "rgba(8,6,4,0.9)", borderTop: "1px solid rgba(255,255,255,0.06)", flexShrink: 0 },
  nav: { position: "absolute", bottom: 0, left: 0, right: 0, height: 68, background: "rgba(8,6,4,0.97)", borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-around", alignItems: "center", backdropFilter: "blur(20px)" },
  overlay: { position: "absolute", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(10px)" },
  matchBox: { background: "linear-gradient(155deg,#1c1610,#0f0c08)", borderRadius: 26, padding: "38px 28px", textAlign: "center", maxWidth: 310, width: "90%", border: "1px solid rgba(212,160,123,0.18)", position: "relative", overflow: "hidden" },
  matchGlow: { position: "absolute", top: "-50%", left: "50%", transform: "translateX(-50%)", width: 280, height: 280, borderRadius: "50%", background: "radial-gradient(circle, rgba(212,160,123,0.14) 0%, transparent 70%)", pointerEvents: "none" },
  matchTitle: { fontFamily: "'Cormorant Garamond', serif", fontSize: 36, fontWeight: 300, color: "#f0e6dc", marginBottom: 18 },
  matchAvas: { display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 18 },
  matchAva: { width: 78, height: 78, borderRadius: "50%", objectFit: "cover", border: "3px solid rgba(212,160,123,0.45)" },
  matchName: { fontFamily: "'Cormorant Garamond', serif", fontSize: 22, color: "#f0e6dc", fontWeight: 400 },
  matchSpec: { color: "rgba(212,160,123,0.65)", fontSize: 13, fontFamily: "'DM Sans'", marginTop: 4, marginBottom: 22 },
  matchBtn: { width: "100%", padding: "13px", background: "linear-gradient(135deg,#d4a07b,#c4855a)", border: "none", borderRadius: 14, color: "#fff", fontFamily: "'DM Sans'", fontWeight: 600, fontSize: 15, cursor: "pointer", marginBottom: 10 },
  matchSkip: { background: "none", border: "none", color: "rgba(255,255,255,0.3)", fontFamily: "'DM Sans'", fontSize: 13, cursor: "pointer", width: "100%", padding: "6px" },
  modal: { background: "#131008", width: "100%", maxHeight: "90vh", borderRadius: "22px 22px 0 0", overflow: "hidden", position: "relative" },
  modalX: { position: "absolute", top: 12, right: 14, background: "rgba(0,0,0,0.55)", border: "none", color: "#fff", fontSize: 15, width: 30, height: 30, borderRadius: "50%", cursor: "pointer", zIndex: 5, display: "flex", alignItems: "center", justifyContent: "center" },
  modalInner: { overflowY: "auto", maxHeight: "90vh" },
  modalCover: { width: "100%", height: 210, objectFit: "cover", display: "block" },
  modalBody: { padding: "18px 20px 40px" },
  modalHead: { display: "flex", gap: 14, alignItems: "flex-start", marginBottom: 14 },
  modalAva: { width: 60, height: 60, borderRadius: "50%", objectFit: "cover", border: "2px solid rgba(212,160,123,0.35)", flexShrink: 0 },
  modalName: { fontFamily: "'Cormorant Garamond', serif", fontSize: 22, color: "#f0e6dc", fontWeight: 400 },
  modalSpec: { color: "#d4a07b", fontSize: 13, fontFamily: "'DM Sans'", marginTop: 3 },
  modalMeta: { color: "rgba(255,255,255,0.42)", fontSize: 12, fontFamily: "'DM Sans'", marginTop: 3 },
  modalBio: { color: "rgba(255,255,255,0.58)", fontSize: 14, fontFamily: "'DM Sans'", lineHeight: 1.6, marginBottom: 14 },
  portTitle: { fontFamily: "'Cormorant Garamond', serif", fontSize: 18, color: "#f0e6dc", marginBottom: 10 },
  portGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14 },
  portThumb: { width: "100%", height: 128, objectFit: "cover", borderRadius: 12 },
  profileCard: { background: "linear-gradient(140deg,rgba(212,160,123,0.1),rgba(196,133,90,0.04))", borderRadius: 18, padding: "24px 18px", textAlign: "center", border: "1px solid rgba(212,160,123,0.12)", display: "flex", flexDirection: "column", alignItems: "center" },
  roadItem: { display: "flex", alignItems: "center", gap: 14, padding: "14px", background: "rgba(255,255,255,0.03)", borderRadius: 13, marginBottom: 8, border: "1px solid rgba(255,255,255,0.04)" },
};

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300&family=DM+Sans:wght@300;400;500;600&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent}
  ::-webkit-scrollbar{width:0}
  .tag{background:rgba(212,160,123,0.1);color:#c4855a;border-radius:18px;padding:4px 10px;font-size:11px;font-family:'DM Sans';font-weight:500;border:1px solid rgba(196,133,90,0.18)}
  .pill{border:none;border-radius:18px;padding:6px 14px;font-family:'DM Sans';font-size:12px;font-weight:500;cursor:pointer;transition:all 0.2s;white-space:nowrap}
  .abtn{border:none;cursor:pointer;border-radius:50%;display:flex;align-items:center;justify-content:center;transition:all 0.25s cubic-bezier(.34,1.56,.64,1)}
  .abtn:hover{transform:scale(1.12)}
  .abtn:active{transform:scale(0.94)}
  .nav-btn{display:flex;flex-direction:column;align-items:center;gap:3px;background:none;border:none;cursor:pointer;font-family:'DM Sans';transition:all 0.2s}
  .minput{background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.09);border-radius:22px;padding:10px 16px;color:#fff;font-family:'DM Sans';font-size:14px;outline:none;flex:1}
  .minput::placeholder{color:rgba(255,255,255,0.28)}
  .card-in{animation:cardIn 0.38s cubic-bezier(.34,1.56,.64,1)}
  @keyframes cardIn{from{opacity:0;transform:scale(0.93) translateY(14px)}to{opacity:1;transform:scale(1) translateY(0)}}
  .go-right{animation:goRight 0.34s ease-in forwards}
  .go-left{animation:goLeft 0.34s ease-in forwards}
  @keyframes goRight{to{transform:translateX(120%) rotate(18deg);opacity:0}}
  @keyframes goLeft{to{transform:translateX(-120%) rotate(-18deg);opacity:0}}
  .pop{animation:pop 0.45s cubic-bezier(.34,1.56,.64,1)}
  @keyframes pop{from{transform:scale(0.72);opacity:0}to{transform:scale(1);opacity:1}}
  @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}
  .stamp-like{position:absolute;top:24px;left:18px;border:3px solid #4ecb71;color:#4ecb71;border-radius:7px;padding:3px 10px;font-family:'Cormorant Garamond';font-weight:700;font-size:26px;letter-spacing:2px;transform:rotate(-12deg);opacity:0;transition:opacity 0.12s;z-index:10}
  .stamp-nope{position:absolute;top:24px;right:18px;border:3px solid #ff4d6d;color:#ff4d6d;border-radius:7px;padding:3px 10px;font-family:'Cormorant Garamond';font-weight:700;font-size:26px;letter-spacing:2px;transform:rotate(12deg);opacity:0;transition:opacity 0.12s;z-index:10}
  .show-stamp{opacity:1!important}
`;
