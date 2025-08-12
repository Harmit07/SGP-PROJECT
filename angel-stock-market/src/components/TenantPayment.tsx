import React, { useEffect, useState } from "react";
import {
  CreditCard,
  Landmark,
  Smartphone,
  Mail,
  MessageCircle,
  Bell,
  Clock,
  Check,
  ChevronLeft,
} from "lucide-react";

/* ----------------------------- constants ------------------------------ */
const RED = "#E53935";
const ICON_BG = "#F44336";
const REF_GREEN = "#00C30E";

type SectionKey = "autoPay" | "payMyShare" | "coTenants" | "securityDeposit";

type CoTenant = {
  id: string;
  name: string;
  initial: string;
  status: "Paid" | "Pending";
  share: string;
  avatarUrl?: string;
};

type DepositItem = { id: string; label: string; amount: string };

type SampleDataType = {
  rentAmount: string;
  rentCycle: string;
  dueDayText: string;
  nextDueDate: string;
  paymentMethodId: string;
  paymentMethodLabel: string;
  autoPayMethodLabel: string;
  cardMasked: string;
  myShare: string;
  totalRent: string;
  depositTotal: string;
  depositRefundable: string;
  refundStatus: "Pending" | "Completed";
  estimatedTransferDate: string;
  coTenants: CoTenant[];
  depositItems: DepositItem[];
};

const defaultSampleData: SampleDataType = {
  rentAmount: "₹55,000",
  rentCycle: "/Jan",
  dueDayText: "5th of every month",
  nextDueDate: "2025-07-05",
  paymentMethodId: "upi",
  paymentMethodLabel: "UPI (Google, Phone Pay)",
  autoPayMethodLabel: "Master Card",
  cardMasked: "** ** ** 4242",
  myShare: "₹27,500",
  totalRent: "₹55,000",
  depositTotal: "₹2,00,000",
  depositRefundable: "₹1,97,000",
  refundStatus: "Pending",
  estimatedTransferDate: "2/11/2025",
  coTenants: [
    { id: "john", name: "John", initial: "J", status: "Paid", share: "₹27,500", avatarUrl: "" },
    { id: "chris", name: "Chris Taylor", initial: "C", status: "Pending", share: "₹27,500", avatarUrl: "" },
  ],
  depositItems: [
    { id: "cleaning", label: "Cleaning Fees", amount: "-₹2000" },
    { id: "repairs", label: "Repairs", amount: "-₹1000" },
  ],
};

/* ----------------------------- helpers -------------------------------- */

function formatDateParts(iso?: string) {
  if (!iso) return { day: "--", monthText: "—", year: "—" };
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return { day: "--", monthText: "—", year: "—" };
  const day = String(d.getDate()).padStart(2, "0");
  const monthText = d.toLocaleString(undefined, { month: "long" });
  const year = String(d.getFullYear());
  return { day, monthText, year };
}

/* --------------------------- data hook -------------------------------- */
function useTenantData(initial: SampleDataType = defaultSampleData) {
  const [data, setData] = useState<SampleDataType>(initial);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Ready for integration with backend fetch
    // setLoading(true);
    // fetch("/api/tenant-payment").then(r => r.json()).then(d => setData(d)).finally(() => setLoading(false));
  }, []);

  return { data, setData, loading };
}

/* --------------------------- small components ------------------------- */

const IconBubble: React.FC<{ children: React.ReactNode; size?: number }> = ({ children, size = 44 }) => (
  <div
    className="flex items-center justify-center flex-shrink-0"
    style={{
      width: size,
      height: size,
      borderRadius: "999px",
      background: ICON_BG,
      color: "#fff",
    }}
  >
    {children}
  </div>
);

const Toggle: React.FC<{ checked?: boolean; onChange?: (v: boolean) => void; variant?: "red" | "black" }> = ({
  checked = false,
  onChange,
  variant = "red",
}) => {
  const track = variant === "red" ? "peer-checked:bg-[var(--red)]" : "peer-checked:bg-black";
  return (
    <label style={{ ["--red" as any]: RED } as React.CSSProperties} className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        className="sr-only peer"
        checked={checked}
        onChange={(e) => onChange && onChange(e.target.checked)}
      />
      <div className={`w-12 h-6 rounded-full bg-gray-200 ${track}`} />
      <div className="absolute left-0.5 top-0.5 w-5 h-5 rounded-full bg-white transition-transform peer-checked:translate-x-6 shadow-sm" />
    </label>
  );
};

const SectionHeader: React.FC<{ title: string; onBack?: () => void }> = ({ title, onBack }) => (
  <div className="mb-6">
    <div className="grid grid-cols-3 items-center">
      <div className="flex items-center">
        <button
          onClick={onBack}
          type="button"
          aria-label="back"
          className="w-9 h-9 flex items-center justify-center bg-white border border-gray-200 text-gray-600 rounded-sm"
        >
          <ChevronLeft size={16} />
        </button>
      </div>
      <div className="flex justify-center">
        <h3 className="text-2xl md:text-3xl font-semibold">{title}</h3>
      </div>
      <div />
    </div>
  </div>
);

const RedButton: React.FC<{ onClick?: () => void; children: React.ReactNode }> = ({ onClick, children }) => (
  <button
    onClick={onClick}
    className="w-full py-3 md:py-4 rounded-md text-white font-semibold text-sm md:text-lg"
    style={{ background: RED }}
  >
    {children}
  </button>
);

/* --------------------------- main component --------------------------- */

const TenantPayment: React.FC = () => {
  const { data, setData, loading } = useTenantData();
  const [active, setActive] = useState<SectionKey>("autoPay");

  const paymentMethods = [
    { id: "card", label: "Credit Card", icon: <CreditCard size={16} color="#fff" /> },
    { id: "bank", label: "Bank Transfer", icon: <Landmark size={16} color="#fff" /> },
    { id: "upi", label: "UPI (Google, Phone Pay)", icon: <Smartphone size={16} color="#fff" /> },
  ];

  useEffect(() => {
    // keep dynamic; for demo we use defaultSampleData
  }, []);

  const changePaymentMethod = (id: string) => {
    const m = paymentMethods.find((p) => p.id === id);
    setData({ ...data, paymentMethodId: id, paymentMethodLabel: m ? m.label : data.paymentMethodLabel });
  };

  const goNext = () =>
    setActive((s) => (s === "autoPay" ? "payMyShare" : s === "payMyShare" ? "coTenants" : s === "coTenants" ? "securityDeposit" : "autoPay"));

  const goBack = () =>
    setActive((s) => (s === "securityDeposit" ? "coTenants" : s === "coTenants" ? "payMyShare" : s === "payMyShare" ? "autoPay" : "autoPay"));

  if (loading) return <div className="py-20 text-center">Loading...</div>;

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-[1090px] mx-auto px-2 md:px-0 text-left">
        <div className="py-6">
          {active === "autoPay" && <AutoPaySection sample={data} onNext={goNext} onBack={goBack} />}
          {active === "payMyShare" && (
            <PayMyShareSection sample={data} paymentMethods={paymentMethods} onChange={changePaymentMethod} onNext={goNext} onBack={goBack} />
          )}
          {active === "coTenants" && <CoTenantsSection sample={data} onNext={goNext} onBack={goBack} />}
          {active === "securityDeposit" && <SecurityDepositSection sample={data} onNext={goNext} onBack={goBack} />}
        </div>
      </div>
    </div>
  );
};

/* --------------------------- sections -------------------------------- */

const AutoPaySection: React.FC<{ sample: SampleDataType; onNext: () => void; onBack: () => void }> = ({ sample, onNext, onBack }) => {
  // defaults set to false to match screenshots
  const [autoPay, setAutoPay] = useState<boolean>(false);
  const [reminders, setReminders] = useState<boolean>(false);
  const [email, setEmail] = useState<boolean>(false);
  const [sms, setSms] = useState<boolean>(false);
  const [appNotif, setAppNotif] = useState<boolean>(false);
  const { day, monthText, year } = formatDateParts(sample.nextDueDate);

  return (
    <section>
      <SectionHeader title="Set Auto Pay" onBack={onBack} />

      {/* Transaction */}
      <div className="bg-white rounded-lg border border-gray-100 p-6 mb-6">
        <div className="text-sm font-medium text-gray-600 mb-3">Transaction</div>

        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-[54px] h-[66px] bg-black rounded-[6px] text-white flex flex-col items-center justify-center">
              <div className="text-lg font-bold leading-none">{day}</div>
              <div className="text-[10px] mt-1 leading-tight">{monthText} {year}</div>
            </div>

            <div>
              <div className="text-sm text-gray-700">Rent Amount</div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-semibold text-red-600">{sample.rentAmount}</span>
                <span className="text-sm font-medium text-gray-700">{sample.rentCycle}</span>
              </div>
              <div className="text-sm text-gray-600 mt-1">Due Date • {sample.dueDayText}</div>
            </div>
          </div>

          <div className="md:text-right">
            <div className="text-sm text-gray-700">Payment Method</div>
            <div className="flex items-center justify-end gap-3 mt-2">
              <img src="https://upload.wikimedia.org/wikipedia/commons/0/04/Mastercard-logo.png" alt="mc" className="w-10 h-10 object-contain" />
              <div className="text-sm text-gray-800">
                <div className="font-medium">{sample.autoPayMethodLabel}</div>
                <div className="text-sm text-gray-500">{sample.cardMasked}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Permission */}
      <div className="bg-white rounded-md border border-gray-100 p-4 mb-4">
        <div className="text-sm font-medium text-gray-600 mb-2">Permission</div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <IconBubble size={44}>
              <CreditCard size={18} />
            </IconBubble>
            <div className="font-medium text-gray-800">Auto Pay</div>
          </div>
          <Toggle checked={autoPay} onChange={setAutoPay} variant="black" />
        </div>
      </div>

      {/* Payment Reminders */}
      <div className="bg-white rounded-md border border-gray-100 p-4 mb-4">
        <div className="text-sm font-medium text-gray-600 mb-2">Payment Reminders</div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <IconBubble size={44}>
              <Clock size={18} />
            </IconBubble>
            <div className="font-medium text-gray-800">Get notified 3 days before rent is due</div>
          </div>
          <Toggle checked={reminders} onChange={setReminders} variant="black" />
        </div>
      </div>

      {/* Notification Options */}
      <div className="bg-white rounded-md border border-gray-100 p-4 mb-6">
        <div className="text-sm font-medium text-gray-600 mb-2">Notification Options</div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <IconBubble size={44}>
                <Mail size={16} />
              </IconBubble>
              <div className="font-medium text-gray-800">Email</div>
            </div>
            <Toggle checked={email} onChange={setEmail} variant="black" />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <IconBubble size={44}>
                <MessageCircle size={16} />
              </IconBubble>
              <div className="font-medium text-gray-800">SMS</div>
            </div>
            <Toggle checked={sms} onChange={setSms} variant="black" />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <IconBubble size={44}>
                <Bell size={16} />
              </IconBubble>
              <div className="font-medium text-gray-800">App Notification</div>
            </div>
            <Toggle checked={appNotif} onChange={setAppNotif} variant="black" />
          </div>
        </div>
      </div>

      <div className="mb-2">
        <RedButton onClick={onNext}>Save Settings</RedButton>
      </div>
    </section>
  );
};

const PayMyShareSection: React.FC<{
  sample: SampleDataType;
  paymentMethods: { id: string; label: string; icon?: React.ReactNode }[];
  onChange: (id: string) => void;
  onNext: () => void;
  onBack: () => void;
}> = ({ sample, paymentMethods, onChange, onNext, onBack }) => {
  const [selected, setSelected] = useState<string>(sample.paymentMethodId);

  useEffect(() => {
    setSelected(sample.paymentMethodId);
  }, [sample.paymentMethodId]);

  const choose = (id: string) => {
    setSelected(id);
    onChange(id);
  };

  const primaryTenant = sample.coTenants[0];

  return (
    <section>
      <SectionHeader title="Manage Rent Split" onBack={onBack} />

      <div className="text-sm text-gray-700 mb-2">Rent Payment</div>

      {/* My Share pill */}
      <div className="bg-white rounded-md border border-red-200 p-2 mb-6">
        <div className="flex items-center justify-between px-2 py-2 rounded-md border border-red-200">
          <div className="flex items-center gap-3">
            {primaryTenant?.avatarUrl ? (
              <img src={primaryTenant.avatarUrl} alt={primaryTenant.name} className="w-8 h-8 rounded-full object-cover" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-red-50 text-red-600 flex items-center justify-center text-sm font-semibold">
                {primaryTenant?.initial ?? "T"}
              </div>
            )}
            <div className="text-gray-800 font-medium">{primaryTenant?.name ?? "My Share"}</div>
          </div>
          <div className="text-gray-900 font-semibold">{sample.myShare}</div>
        </div>
      </div>

      <div className="text-sm font-semibold text-gray-800 mb-3">Select Payment Method</div>

      <div className="bg-white rounded-md border border-gray-200 mb-5">
        {paymentMethods.map((m, i) => (
          <div key={m.id} className={`${i > 0 ? "border-t border-gray-100" : ""}`}>
            <div
              onClick={() => choose(m.id)}
              className="flex items-center justify-between p-4 cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: ICON_BG }}>
                  {m.icon}
                </div>
                <div className="text-base text-gray-800 font-medium">{m.label}</div>
              </div>

              {/* radio: circle with small green dot when selected */}
              <div className="w-7 h-7 rounded-full flex items-center justify-center bg-white" style={{ border: `2px solid ${selected === m.id ? REF_GREEN : "#D1D5DB"}` }}>
                {selected === m.id ? <div style={{ width: 10, height: 10, borderRadius: 999, background: REF_GREEN }} /> : <div style={{ width: 8, height: 8, borderRadius: 999 }} />}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div>
        <RedButton onClick={onNext}>Confirm &amp; Pay</RedButton>
      </div>
    </section>
  );
};

const CoTenantsSection: React.FC<{ sample: SampleDataType; onNext: () => void; onBack: () => void }> = ({ sample, onNext, onBack }) => {
  const [sendReminder, setSendReminder] = useState<boolean>(false);
  const pendingTenant = sample.coTenants.find((t) => t.status === "Pending");
  const reminderName = pendingTenant ? pendingTenant.name : "Tenant";

  return (
    <section>
      <SectionHeader title="Manage Rent Split" onBack={onBack} />

      <div className="flex items-center justify-between mb-3">
        <div className="text-sm text-gray-700">Total Rent</div>
        <div className="text-sm font-medium text-gray-900">{sample.totalRent}</div>
      </div>

      <div className="text-sm font-medium text-gray-700 mb-2">Tenants in Agreements</div>

      {/* Tenants box with subtle red border */}
      <div className="bg-white rounded-lg border border-red-200 p-4 mb-6">
        {sample.coTenants.map((t, idx) => (
          <div key={t.id} className={`${idx > 0 ? "border-t border-gray-100 mt-3 pt-3" : ""} flex items-start justify-between`}>
            <div className="flex items-start gap-4">
              {/* avatar */}
              {t.avatarUrl ? (
                <img src={t.avatarUrl} alt={t.name} className="w-12 h-12 rounded-full object-cover" />
              ) : (
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold ${t.status === "Paid" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"}`}>
                  {t.initial}
                </div>
              )}

              <div>
                <div className="font-medium text-gray-800">{t.name}</div>
                <div className="text-xs text-gray-500 mt-1">Status</div>
              </div>
            </div>

            <div className="flex flex-col items-end justify-between">
              <div className="text-sm text-gray-700">{t.share}</div>
              <div className="mt-2">
                {t.status === "Paid" ? (
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md text-sm font-medium" style={{ background: `rgba(0,195,14,0.08)`, color: REF_GREEN }}>
                    <Check size={14} color={REF_GREEN} />
                    <span>Paid</span>
                  </div>
                ) : (
                  <div className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium" style={{ background: RED, color: "#fff" }}>
                    Pending
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-md border border-gray-100 p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <IconBubble size={44}>
              <Bell size={16} />
            </IconBubble>
            <div className="font-medium text-gray-800">Send Reminder to {reminderName}</div>
          </div>
          <Toggle checked={sendReminder} onChange={setSendReminder} variant="black" />
        </div>
      </div>

      <div className="mt-6">
        <RedButton onClick={onNext}>Pay My Share</RedButton>
      </div>
    </section>
  );
};

const SecurityDepositSection: React.FC<{ sample: SampleDataType; onNext: () => void; onBack: () => void }> = ({ sample, onNext, onBack }) => {
  return (
    <section>
      <SectionHeader title="Security Deposit" onBack={onBack} />

      <div className="mb-4">
        <div className="text-sm text-gray-700">
          Total Deposit: <span className="font-medium">{sample.depositTotal}</span>
        </div>
        <div className="text-sm text-gray-700 mt-1">
          Refund Status: {" "}
          {sample.refundStatus === "Pending" ? (
            <span className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium" style={{ background: RED, color: "#fff" }}>
              {sample.refundStatus}
            </span>
          ) : (
            <span className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium" style={{ background: `rgba(0,195,14,0.08)`, color: REF_GREEN }}>
              {sample.refundStatus}
            </span>
          )}
        </div>
      </div>

      <div className="bg-white rounded-md border border-gray-100 p-5 mb-4">
        <div className="text-sm font-medium text-gray-700 mb-3">Deductions</div>
        {sample.depositItems.map((it) => (
          <div key={it.id} className="flex justify-between text-gray-700 py-2">
            <div>{it.label}</div>
            <div>{it.amount}</div>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-100 pt-4 mb-6">
        <div className="text-lg font-semibold">
          Total Refundable: <span className="ml-2 font-medium">{sample.depositRefundable}</span>
        </div>
        <div className="text-sm text-gray-700 mt-1">
          Estimated Transfer Date: <span className="font-medium">{sample.estimatedTransferDate}</span>
        </div>
      </div>

      <div>
        {/* Back button should navigate back, not next */}
        <RedButton onClick={onBack}>Back</RedButton>
      </div>
    </section>
  );
};

export default TenantPayment;