import { useEffect, useState, useRef } from "react";
import styled, { keyframes } from "styled-components";
import axios from "axios";
import { url, setHeaders } from "../../../features/api";

const AdminChat = () => {
  const [conversations, setConversations] = useState([]);
  const [selected, setSelected] = useState(null);
  const [messages, setMessages] = useState([]);
  const [reply, setReply] = useState("");
  const messagesEndRef = useRef(null);

  /* ================= FETCH CONVERSATIONS ================= */
  const fetchConversations = async () => {
    try {
      const res = await axios.get(
        `${url}/chat/admin/conversations`,
        setHeaders(),
      );
      setConversations(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  /* ================= FETCH MESSAGES ================= */
  const fetchMessages = async (convId) => {
    try {
      const res = await axios.get(
        `${url}/chat/admin/messages/${convId}`,
        setHeaders(),
      );
      setMessages(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  /* ================= POLLING ================= */
  useEffect(() => {
    fetchConversations();
    const interval = setInterval(() => {
      fetchConversations();
      if (selected) fetchMessages(selected._id);
    }, 2000);
    return () => clearInterval(interval);
  }, [selected]);

  /* ================= AUTO SCROLL ================= */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* ================= SELECT CONVERSATION ================= */
  const handleSelect = (conv) => {
    setSelected(conv);
    fetchMessages(conv._id);
    setReply("");
  };

  /* ================= SEND REPLY ================= */
  const handleReply = async () => {
    if (!reply.trim() || !selected) return;
    try {
      await axios.post(
        `${url}/chat/admin/reply/${selected._id}`,
        { text: reply },
        setHeaders(),
      );
      setReply("");
      fetchMessages(selected._id);
    } catch (err) {
      console.log(err);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleReply();
  };

  return (
    <Wrapper>
      <PageTitle>Hỗ trợ khách hàng</PageTitle>

      <ChatLayout>
        {/* ===== SIDEBAR ===== */}
        <Sidebar>
          <SidebarHeader>Hội thoại ({conversations.length})</SidebarHeader>
          {conversations.length === 0 ? (
            <EmptyConv>Chưa có hội thoại nào</EmptyConv>
          ) : (
            conversations.map((conv) => (
              <ConvItem
                key={conv._id}
                $active={selected?._id === conv._id}
                onClick={() => handleSelect(conv)}
              >
                <ConvAvatar>
                  {conv.userId?.name?.charAt(0)?.toUpperCase() || "?"}
                </ConvAvatar>
                <ConvInfo>
                  <ConvName>{conv.userId?.name || "Ẩn danh"}</ConvName>
                  <ConvEmail>{conv.userId?.email || ""}</ConvEmail>
                  <ConvLast>{conv.lastMessage}</ConvLast>
                </ConvInfo>
              </ConvItem>
            ))
          )}
        </Sidebar>

        {/* ===== CHAT AREA ===== */}
        <ChatArea>
          {!selected ? (
            <NoneSelected>
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#cbd5e1"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              <p>Chọn một hội thoại để bắt đầu</p>
            </NoneSelected>
          ) : (
            <>
              <ChatHeader>
                <ChatHeaderAvatar>
                  {selected.userId?.name?.charAt(0)?.toUpperCase() || "?"}
                </ChatHeaderAvatar>
                <ChatHeaderInfo>
                  <ChatHeaderName>{selected.userId?.name}</ChatHeaderName>
                  <ChatHeaderEmail>{selected.userId?.email}</ChatHeaderEmail>
                </ChatHeaderInfo>
              </ChatHeader>

              <Messages>
                {messages.map((msg) => (
                  <MessageRow key={msg._id} $admin={msg.isAdmin}>
                    {!msg.isAdmin && (
                      <MsgAvatar>
                        {selected.userId?.name?.charAt(0)?.toUpperCase() || "?"}
                      </MsgAvatar>
                    )}
                    <Message $admin={msg.isAdmin}>
                      <SenderName $admin={msg.isAdmin}>{msg.sender}</SenderName>
                      <p>{msg.text}</p>
                    </Message>
                  </MessageRow>
                ))}
                <div ref={messagesEndRef} />
              </Messages>

              <InputRow>
                <ReplyInput
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={`Trả lời ${selected.userId?.name}...`}
                />
                <SendBtn onClick={handleReply} disabled={!reply.trim()}>
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
                  Gửi
                </SendBtn>
              </InputRow>
            </>
          )}
        </ChatArea>
      </ChatLayout>
    </Wrapper>
  );
};

export default AdminChat;

/* ================= STYLES ================= */
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const Wrapper = styled.div`
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  height: calc(100vh - 64px);
  box-sizing: border-box;
`;

const PageTitle = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
`;

const ChatLayout = styled.div`
  display: flex;
  gap: 1.5rem;
  flex: 1;
  min-height: 0;
`;

/* ===== SIDEBAR ===== */
const Sidebar = styled.div`
  width: 280px;
  flex-shrink: 0;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;

  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: #e2e8f0;
    border-radius: 4px;
  }
`;

const SidebarHeader = styled.div`
  padding: 1rem 1.25rem;
  font-size: 13px;
  font-weight: 700;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  border-bottom: 1px solid #f1f5f9;
  flex-shrink: 0;
`;

const ConvItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 12px 14px;
  cursor: pointer;
  border-bottom: 1px solid #f8fafc;
  background: ${(p) => (p.$active ? "#eff6ff" : "transparent")};
  border-left: 3px solid ${(p) => (p.$active ? "#1d4ed8" : "transparent")};
  transition: background 0.15s;

  &:hover {
    background: ${(p) => (p.$active ? "#eff6ff" : "#f8fafc")};
  }
`;

const ConvAvatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #1e293b;
  color: white;
  font-size: 13px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const ConvInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const ConvName = styled.p`
  font-size: 14px;
  font-weight: 600;
  color: #0f172a;
  margin: 0 0 1px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ConvEmail = styled.p`
  font-size: 11px;
  color: #94a3b8;
  margin: 0 0 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ConvLast = styled.p`
  font-size: 12px;
  color: #64748b;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const EmptyConv = styled.div`
  padding: 2rem;
  text-align: center;
  font-size: 13px;
  color: #94a3b8;
`;

/* ===== CHAT AREA ===== */
const ChatArea = styled.div`
  flex: 1;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;
`;

const NoneSelected = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;

  p {
    font-size: 14px;
    color: #94a3b8;
    margin: 0;
  }
`;

const ChatHeader = styled.div`
  height: 60px;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 1.5rem;
  flex-shrink: 0;
`;

const ChatHeaderAvatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #1e293b;
  color: white;
  font-size: 13px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const ChatHeaderInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1px;
`;

const ChatHeaderName = styled.span`
  font-size: 14px;
  font-weight: 700;
  color: #0f172a;
`;

const ChatHeaderEmail = styled.span`
  font-size: 12px;
  color: #64748b;
`;

const Messages = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: #f8fafc;
  animation: ${fadeIn} 0.2s ease;

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
  gap: 8px;
  justify-content: ${(p) => (p.$admin ? "flex-end" : "flex-start")};
`;

const MsgAvatar = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #e2e8f0;
  color: #475569;
  font-size: 11px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const Message = styled.div`
  max-width: 65%;
  padding: 8px 12px;
  border-radius: ${(p) =>
    p.$admin ? "12px 4px 12px 12px" : "4px 12px 12px 12px"};
  background: ${(p) => (p.$admin ? "#1e293b" : "#ffffff")};
  border: 1px solid ${(p) => (p.$admin ? "transparent" : "#e2e8f0")};

  p {
    margin: 0;
    font-size: 13.5px;
    color: ${(p) => (p.$admin ? "#f1f5f9" : "#334155")};
    line-height: 1.5;
  }
`;

const SenderName = styled.span`
  font-size: 11px;
  font-weight: 600;
  color: ${(p) => (p.$admin ? "#94a3b8" : "#64748b")};
  display: block;
  margin-bottom: 2px;
`;

const InputRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 1rem 1.5rem;
  border-top: 1px solid #e2e8f0;
  background: white;
  flex-shrink: 0;
`;

const ReplyInput = styled.input`
  flex: 1;
  height: 40px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 0 14px;
  font-size: 14px;
  outline: none;
  color: #0f172a;
  background: #f8fafc;
  transition: border-color 0.15s;

  &:focus {
    border-color: #1d4ed8;
    background: #fff;
  }
  &::placeholder {
    color: #94a3b8;
  }
`;

const SendBtn = styled.button`
  height: 40px;
  padding: 0 16px;
  border: none;
  border-radius: 8px;
  background: ${(p) => (p.disabled ? "#e2e8f0" : "#1e293b")};
  color: ${(p) => (p.disabled ? "#94a3b8" : "white")};
  font-size: 14px;
  font-weight: 600;
  cursor: ${(p) => (p.disabled ? "not-allowed" : "pointer")};
  display: flex;
  align-items: center;
  gap: 6px;
  transition: background 0.15s;

  &:hover:not(:disabled) {
    background: #0f172a;
  }
`;
