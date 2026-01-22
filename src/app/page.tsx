'use client';

import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Cog, HardHat, Calendar } from 'lucide-react';

export default function MainMenuPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    } else if (!isUserLoading && user && (user as any).role === 'user_fast') {
      router.push('/fast');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/40">
        <p>Carregando...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4">
      <div className="mx-auto mb-12 flex flex-col items-center justify-center text-center">
        <Cog className="h-20 w-20 animate-spin text-primary" style={{ animationDuration: '5s' }} />
        <h1 className="mt-4 text-3xl font-bold uppercase tracking-wider text-foreground/80">
          MENU PRINCIPAL
        </h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Link href="/planning">
          <Button variant="outline" className="h-40 w-80 text-2xl flex flex-col gap-2">
            <Calendar className="h-12 w-12" />
            <span>Planejamento Semanal</span>
          </Button>
        </Link>
        <Link href="/fast">
          <Button variant="outline" className="h-40 w-80 text-2xl flex flex-col gap-2">
            <HardHat className="h-12 w-12" />
            <span>FAST</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}
