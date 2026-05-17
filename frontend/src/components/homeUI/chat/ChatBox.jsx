import { useEffect, useState, useRef } from "react";
import styled, { keyframes } from "styled-components";
import axios from "axios";
import { useSelector } from "react-redux";
import { url, setHeaders } from "../../../features/api";

const ChatBox = () => {
  const auth = useSelector((state) => state.auth);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);
  const [unread, setUnread] = useState(0);
  const messagesEndRef = useRef(null);
  const prevCountRef = useRef(0);

  const fetchMessages = async () => {
    if (!auth?._id) {
      setMessages([]);
      return;
    }
    try {
      const res = await axios.get(`${url}/chat/messages`, setHeaders());
      const newMessages = res.data;
      if (!open) {
        const adminMessages = newMessages.filter((m) => m.isAdmin);
        const newAdminCount = adminMessages.length;
        if (newAdminCount > prevCountRef.current)
          setUnread((prev) => prev + (newAdminCount - prevCountRef.current));
        prevCountRef.current = newAdminCount;
      }
      setMessages(newMessages);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 2000);
    return () => clearInterval(interval);
  }, [auth?._id, open]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  const handleOpen = () => {
    setOpen(true);
    setUnread(0);
    prevCountRef.current = messages.filter((m) => m.isAdmin).length;
  };

  const sendMessage = async () => {
    if (!text.trim()) return;
    if (!auth?._id) {
      alert("Vui lòng đăng nhập");
      return;
    }
    try {
      await axios.post(`${url}/chat/send`, { text }, setHeaders());
      setText("");
      fetchMessages();
    } catch (err) {
      console.log(err);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  if (auth?.isAdmin) return null;

  return (
    <Wrapper>
      {open && (
        <Container>
          {/* ── Header ── */}
          <Header>
            <HeaderLeft>
              <Avatar>TC</Avatar>
              <HeaderInfo>
                <HeaderTitle>Hỗ trợ khách hàng</HeaderTitle>
                <StatusRow>
                  <StatusDot />
                  <HeaderSub>Thường phản hồi trong vài phút</HeaderSub>
                </StatusRow>
              </HeaderInfo>
            </HeaderLeft>
            <CloseBtn onClick={() => setOpen(false)}>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </CloseBtn>
          </Header>

          {/* ── Messages ── */}
          <Messages>
            {!auth?._id ? (
              <Empty>Vui lòng đăng nhập để chat với chúng tôi</Empty>
            ) : messages.length === 0 ? (
              <Empty>Xin chào! Chúng tôi có thể giúp gì cho bạn?</Empty>
            ) : (
              messages.map((msg) => (
                <MessageRow key={msg._id} $admin={msg.isAdmin}>
                  {msg.isAdmin && <SenderAvatar>TC</SenderAvatar>}
                  <Message $admin={msg.isAdmin}>
                    <SenderName $admin={msg.isAdmin}>{msg.sender}</SenderName>
                    <p>{msg.text}</p>
                  </Message>
                </MessageRow>
              ))
            )}
            <div ref={messagesEndRef} />
          </Messages>

          {/* ── Input ── */}
          <Bottom>
            <Input
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Nhập tin nhắn..."
            />
            <SendBtn onClick={sendMessage} disabled={!text.trim()}>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </SendBtn>
          </Bottom>
        </Container>
      )}

      {/* ── Toggle button ── */}
      {!open && (
        <ToggleBtn onClick={handleOpen}>
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          Chat ngay
          {unread > 0 && (
            <UnreadBadge>{unread > 9 ? "9+" : unread}</UnreadBadge>
          )}
        </ToggleBtn>
      )}
    </Wrapper>
  );
};

export default ChatBox;

/* ═══════════════════════════════════
   STYLED COMPONENTS
═══════════════════════════════════ */

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0%, 100% { box-shadow: 0 0 0 0 rgba(34,197,94,0.5); }
  50%       { box-shadow: 0 0 0 4px rgba(34,197,94,0); }
`;

const Wrapper = styled.div`
  position: fixed;
  right: 24px;
  bottom: 24px;
  z-index: 999999;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 12px;
`;

/* Toggle button */
const ToggleBtn = styled.button`
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  height: 46px;
  padding: 0 20px;
  border-radius: 999px;
  border: none;
  background: #1e293b;
  color: white;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 4px 20px rgba(15, 23, 42, 0.3);
  transition:
    background 0.15s,
    transform 0.1s;
  &:hover { background: #0f172a; }
  }
  &:active {
    transform: scale(0.97);
  }
`;

const UnreadBadge = styled.span`
  position: absolute;
  top: -6px;
  right: -4px;
  background: #dc2626;
  color: white;
  font-size: 10px;
  font-weight: 700;
  min-width: 18px;
  height: 18px;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
  border: 2px solid white;
`;

/* Chat window */
const Container = styled.div`
  width: 340px;
  height: 480px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(29, 78, 216, 0.12);
  display: flex;
  flex-direction: column;
  animation: ${fadeIn} 0.25s ease;
`;

/* Header */
const Header = styled.div`
  height: 64px;
  background: #1e293b;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 14px 0 16px;
  flex-shrink: 0;
`;
const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;
const Avatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.4);
  color: white;
  font-size: 12px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;
const HeaderInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
`;
const HeaderTitle = styled.span`
  font-size: 14px;
  font-weight: 700;
  color: white;
`;
const StatusRow = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`;
const StatusDot = styled.div`
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #22c55e;
  animation: ${pulse} 2s ease-in-out infinite;
  flex-shrink: 0;
`;
const HeaderSub = styled.span`
  font-size: 11px;
  color: rgba(255, 255, 255, 0.7);
`;
const CloseBtn = styled.button`
  width: 30px;
  height: 30px;
  border: none;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s;
  &:hover {
    background: rgba(255, 255, 255, 0.25);
    color: white;
  }
`;

/* Messages */
const Messages = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: #f8fafc;
  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: #e2e8f0;
    border-radius: 4px;
  }
`;
const MessageRow = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 6px;
  justify-content: ${(p) => (p.$admin ? "flex-start" : "flex-end")};
`;
const SenderAvatar = styled.div`
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: #1e293b;
  color: white;
  font-size: 10px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;
const Message = styled.div`
  max-width: 75%;
  padding: 8px 12px;
  border-radius: ${(p) =>
    p.$admin ? "4px 12px 12px 12px" : "12px 4px 12px 12px"};
  background: ${(p) => (p.$admin ? "white" : "#1e293b")};
  border: 1px solid ${(p) => (p.$admin ? "#e2e8f0" : "transparent")};
  p {
    margin: 0;
    font-size: 13.5px;
    color: ${(p) => (p.$admin ? "#334155" : "white")};
    line-height: 1.5;
  }
`;
const SenderName = styled.span`
  font-size: 11px;
  font-weight: 600;
  color: ${(p) => (p.$admin ? "#64748b" : "rgba(255,255,255,0.7)")};
  display: block;
  margin-bottom: 2px;
`;
const Empty = styled.div`
  text-align: center;
  color: #94a3b8;
  font-size: 13px;
  margin-top: 40px;
  line-height: 1.6;
  padding: 0 1rem;
`;

/* Input area */
const Bottom = styled.div`
  height: 60px;
  border-top: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  padding: 0 10px;
  gap: 8px;
  background: white;
  flex-shrink: 0;
`;
const Input = styled.input`
  flex: 1;
  height: 38px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  padding: 0 12px;
  outline: none;
  font-size: 13px;
  color: #0f172a;
  background: #f8fafc;
  transition:
    border-color 0.15s,
    background 0.15s;
  &:focus {
    border-color: #475569;
    background: white;
  }
  &::placeholder {
    color: #94a3b8;
  }
`;
const SendBtn = styled.button`
  width: 38px;
  height: 38px;
  border: none;
  border-radius: 8px;
  background: ${(p) => (p.disabled ? "#e2e8f0" : "#1e293b")};
  color: ${(p) => (p.disabled ? "#94a3b8" : "white")};
  cursor: ${(p) => (p.disabled ? "not-allowed" : "pointer")};
  display: flex;
  align-items: center;
  justify-content: center;
  transition:
    background 0.15s,
    transform 0.1s;
  flex-shrink: 0;
  &:hover:not(:disabled) { background: #0f172a; }
  }
`;
