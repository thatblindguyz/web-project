import styled from "styled-components";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <FooterRoot>
      <FooterMain>
        <FooterInner>
          {/* CỘT 1 — VỀ TECHCOM */}
          <Col>
            <ColTitle>VỀ TECHCOM</ColTitle>
            <ColLinks>
              <ColLink href="#">Giới thiệu</ColLink>
              <ColLink href="#">Tuyển dụng</ColLink>
              <ColLink href="#">Liên hệ</ColLink>
              <ColLink href="#">Tin tức</ColLink>
            </ColLinks>
          </Col>

          {/* CỘT 2 — CHÍNH SÁCH */}
          <Col>
            <ColTitle>CHÍNH SÁCH</ColTitle>
            <ColLinks>
              <ColLink href="#">Chính sách bảo hành</ColLink>
              <ColLink href="#">Chính sách giao hàng</ColLink>
              <ColLink href="#">Chính sách bảo mật</ColLink>
              <ColLink href="#">Chính sách đổi trả</ColLink>
            </ColLinks>
          </Col>

          {/* CỘT 3 — THÔNG TIN */}
          <Col>
            <ColTitle>THÔNG TIN</ColTitle>
            <ColLinks>
              <ColLink href="#">Hệ thống cửa hàng</ColLink>
              <ColLink href="#">Hướng dẫn mua hàng</ColLink>
              <ColLink href="#">Hướng dẫn thanh toán</ColLink>
              <ColLink as={Link} to="/my-orders">
                Tra cứu đơn hàng
              </ColLink>
              <ColLink href="#">Build PC</ColLink>
            </ColLinks>
          </Col>

          {/* CỘT 4 — TỔNG ĐÀI */}
          <Col>
            <ColTitle>TỔNG ĐÀI HỖ TRỢ (8:00 – 21:00)</ColTitle>
            <ColLinks>
              <HotlineRow>
                <HotlineLabel>Mua hàng:</HotlineLabel>
                <HotlineNum href="tel:19001234">1900 1234</HotlineNum>
              </HotlineRow>
              <HotlineRow>
                <HotlineLabel>Bảo hành:</HotlineLabel>
                <HotlineNum href="tel:19001235">1900 1235</HotlineNum>
              </HotlineRow>
              <HotlineRow>
                <HotlineLabel>Khiếu nại:</HotlineLabel>
                <HotlineNum href="tel:18001234">1800 1234</HotlineNum>
              </HotlineRow>
              <HotlineRow>
                <HotlineLabel>Email:</HotlineLabel>
                <HotlineNum href="mailto:support@techcom.vn">
                  support@techcom.vn
                </HotlineNum>
              </HotlineRow>
            </ColLinks>
          </Col>

          {/* CỘT 5 — VẬN CHUYỂN & THANH TOÁN */}
          <Col>
            <ColTitle>ĐƠN VỊ VẬN CHUYỂN</ColTitle>
            <ShipRow>
              <ShipBadge>GHN Express</ShipBadge>
              <ShipBadge>GHTK</ShipBadge>
              <ShipBadge>Viettel Post</ShipBadge>
            </ShipRow>

            <ColTitle style={{ marginTop: "16px" }}>
              CÁCH THỨC THANH TOÁN
            </ColTitle>
            <PayRow>
              <PayBadge $color="#1d4ed8">Thẻ ATM</PayBadge>
              <PayBadge $color="#0f6bb5">JCB</PayBadge>
              <PayBadge $color="#eb001b">MasterCard</PayBadge>
              <PayBadge $color="#1a1f71">VISA</PayBadge>
              <PayBadge $color="#a50064">Momo</PayBadge>
              <PayBadge $color="#16a34a">Tiền mặt</PayBadge>
            </PayRow>
          </Col>
        </FooterInner>
      </FooterMain>

      {/* BOTTOM BAR */}
      <BottomBar>
        <BottomInner>
          {/* SOCIAL */}
          <SocialBlock>
            <SocialLabel>KẾT NỐI VỚI CHÚNG TÔI</SocialLabel>
            <SocialIcons>
              <SocialBtn
                $color="#1877f2"
                href="https://facebook.com"
                target="_blank"
                aria-label="Facebook"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                </svg>
              </SocialBtn>
              <SocialBtn
                $color="#000000"
                href="https://tiktok.com"
                target="_blank"
                aria-label="TikTok"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.74a4.85 4.85 0 01-1.01-.05z" />
                </svg>
              </SocialBtn>
              <SocialBtn
                $color="#ff0000"
                href="https://youtube.com"
                target="_blank"
                aria-label="YouTube"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 00-1.95 1.96A29 29 0 001 12a29 29 0 00.46 5.58A2.78 2.78 0 003.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.95A29 29 0 0023 12a29 29 0 00-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z" />
                </svg>
              </SocialBtn>
              <SocialBtn
                $color="#0068ff"
                href="#"
                target="_blank"
                aria-label="Zalo"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V9h2v7zm4 0h-2V9h2v7z" />
                </svg>
              </SocialBtn>
            </SocialIcons>
          </SocialBlock>

          {/* COPYRIGHT */}
          <Copyright>
            © 2025 TECHCOM. All rights reserved. | Linh kiện máy tính chính hãng
          </Copyright>

          {/* CERTIFIED */}
          <CertBadge>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <polyline points="9 12 11 14 15 10" />
            </svg>
            ĐÃ THÔNG BÁO
            <br />
            BỘ CÔNG THƯƠNG
          </CertBadge>
        </BottomInner>
      </BottomBar>
    </FooterRoot>
  );
};

export default Footer;

/* ═══════════════════════════════════════
   STYLED COMPONENTS
═══════════════════════════════════════ */

const FooterRoot = styled.footer`
  background: #f8fafc;
  border-top: 1px solid #e2e8f0;
  margin-top: auto;
`;

const FooterMain = styled.div`
  padding: 40px 0 32px;
`;

const FooterInner = styled.div`
  max-width: 1320px;
  margin: 0 auto;
  padding: 0 1.5rem;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 2rem;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
  @media (max-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const Col = styled.div``;

const ColTitle = styled.h4`
  font-size: 13px;
  font-weight: 700;
  color: #1e293b;
  letter-spacing: 0.04em;
  margin-bottom: 14px;
  padding-bottom: 8px;
  border-bottom: 2px solid #1d4ed8;
  display: inline-block;
`;

const ColLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ColLink = styled.a`
  font-size: 13.5px;
  color: #64748b;
  text-decoration: none;
  transition:
    color 0.15s,
    padding-left 0.15s;
  &:hover {
    color: #1d4ed8;
    padding-left: 4px;
  }
`;

const HotlineRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const HotlineLabel = styled.span`
  font-size: 13px;
  color: #64748b;
  white-space: nowrap;
`;

const HotlineNum = styled.a`
  font-size: 13.5px;
  font-weight: 600;
  color: #1d4ed8;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

/* Shipping */
const ShipRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

const ShipBadge = styled.span`
  font-size: 11px;
  font-weight: 600;
  color: #374151;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 4px 10px;
`;

/* Payment */
const PayRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

const PayBadge = styled.span`
  font-size: 11px;
  font-weight: 700;
  color: white;
  background: ${(p) => p.$color};
  border-radius: 6px;
  padding: 4px 10px;
`;

/* Bottom bar */
const BottomBar = styled.div`
  background: #1e293b;
  padding: 14px 0;
`;

const BottomInner = styled.div`
  max-width: 1320px;
  margin: 0 auto;
  padding: 0 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
`;

const SocialBlock = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const SocialLabel = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: #94a3b8;
  white-space: nowrap;
  letter-spacing: 0.04em;
`;

const SocialIcons = styled.div`
  display: flex;
  gap: 8px;
`;

const SocialBtn = styled.a`
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: ${(p) => p.$color};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  transition:
    transform 0.15s,
    opacity 0.15s;
  &:hover {
    transform: translateY(-2px);
    opacity: 0.88;
  }
`;

const Copyright = styled.p`
  font-size: 12px;
  color: #64748b;
  text-align: center;
  flex: 1;
`;

const CertBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 10px;
  font-weight: 700;
  color: #1d4ed8;
  background: white;
  border-radius: 8px;
  padding: 6px 12px;
  line-height: 1.3;
  text-align: center;
  white-space: nowrap;
`;
