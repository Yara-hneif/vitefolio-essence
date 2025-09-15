import { useState, useRef, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/navigation/tabs';
import {
  ChevronLeft,
  ChevronRight,
  User,
  Lock,
  Sliders,
  CreditCard,
  Database,
  ShieldAlert,
} from 'lucide-react';

import ProfileCard from './components/ProfileCard';
import SecurityCard from './components/SecurityCard';
import PreferencesCard from './components/PreferencesCard';
import BillingCard from './components/BillingCard';
import DataCard from './components/DataCard';
import DangerCard from './components/DangerCard';

import useProfile from './hooks/useProfile';

const TABS = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'security', label: 'Security', icon: Lock },
  { id: 'preferences', label: 'Preferences', icon: Sliders },
  { id: 'billing', label: 'Billing', icon: CreditCard },
  { id: 'data', label: 'Data', icon: Database },
  { id: 'danger', label: 'Danger', icon: ShieldAlert },
] as const;

type TabId = (typeof TABS)[number]['id'];

export default function DashboardSettings() {
  const { profile, setProfile, loading, handleAvatarChange } = useProfile();
  const [tab, setTab] = useState<TabId>('profile');
  const [activeIndex, setActiveIndex] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const headerRef = useRef<HTMLDivElement>(null);
  const triggerRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const totalTabs = TABS.length;

  const recalcScrollState = () => {
    const el = headerRef.current;
    if (!el) return;
    const { scrollLeft, clientWidth, scrollWidth } = el;
    setCanScrollLeft(scrollLeft > 4);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 4);
    let nearest = 0,
      minDist = Number.POSITIVE_INFINITY;
    triggerRefs.current.forEach((btn, i) => {
      if (!btn) return;
      const dist = Math.abs(btn.offsetLeft - scrollLeft);
      if (dist < minDist) {
        minDist = dist;
        nearest = i;
      }
    });
    setActiveIndex(nearest);
  };

  const scrollTabs = (dir: 'left' | 'right') => {
    const el = headerRef.current;
    if (!el) return;
    const step = Math.round(el.clientWidth * 0.6);
    el.scrollBy({ left: dir === 'left' ? -step : step, behavior: 'smooth' });
  };

  const scrollToIndex = (i: number) => {
    const el = headerRef.current;
    const trg = triggerRefs.current[i];
    if (!el || !trg) return;
    el.scrollTo({ left: trg.offsetLeft - 12, behavior: 'smooth' });
    setTab(TABS[i].id);
    setActiveIndex(i);
  };

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    recalcScrollState();
    const onScroll = () => recalcScrollState();
    el.addEventListener('scroll', onScroll, { passive: true });
    const ro = new ResizeObserver(recalcScrollState);
    ro.observe(el);
    return () => {
      el.removeEventListener('scroll', onScroll);
      ro.disconnect();
    };
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-gray-50 dark:bg-gray-950 min-h-screen">
      <h1 className="text-3xl sm:text-4xl font-extrabold mb-8 text-center">Settings</h1>

      <Tabs value={tab} onValueChange={(v) => setTab(v as TabId)}>
        <div className="relative mb-8">
          {/* arrows */}
          <button
            onClick={() => scrollTabs('left')}
            className={`absolute left-2 top-1/2 -translate-y-1/2 z-20 p-1.5 rounded-full shadow ${canScrollLeft ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => scrollTabs('right')}
            className={`absolute right-2 top-1/2 -translate-y-1/2 z-20 p-1.5 rounded-full shadow ${canScrollRight ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          >
            <ChevronRight size={18} />
          </button>

          {/* tabs */}
          <TabsList
            ref={headerRef}
            className="relative flex gap-2 overflow-x-auto scroll-smooth px-10 py-2 rounded-xl shadow-sm bg-white dark:bg-gray-900 no-scrollbar"
          >
            {TABS.map(({ id, label, icon: Icon }, i) => (
              <TabsTrigger
                ref={(el) => (triggerRefs.current[i] = el)}
                key={id}
                value={id}
                className="flex items-center gap-1 whitespace-nowrap"
              >
                <Icon size={16} /> {label}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* dots */}
          <div className="absolute inset-x-0 bottom-0 translate-y-6 flex justify-center gap-2">
            {TABS.map((_, i) => (
              <button
                key={i}
                onClick={() => scrollToIndex(i)}
                className={`h-2.5 w-2.5 rounded-full ${i === activeIndex ? 'bg-indigo-600' : 'bg-gray-300 hover:bg-gray-400'}`}
              />
            ))}
          </div>
        </div>

        <TabsContent value="profile">
          <ProfileCard
            profile={profile}
            setProfile={setProfile}
            handleAvatarChange={handleAvatarChange}
          />
        </TabsContent>
        <TabsContent value="security">
          <SecurityCard />
        </TabsContent>
        <TabsContent value="preferences">
          <PreferencesCard />
        </TabsContent>
        <TabsContent value="billing">
          <BillingCard />
        </TabsContent>
        <TabsContent value="data">
          <DataCard />
        </TabsContent>
        <TabsContent value="danger">
          <DangerCard />
        </TabsContent>
      </Tabs>
    </div>
  );
}
