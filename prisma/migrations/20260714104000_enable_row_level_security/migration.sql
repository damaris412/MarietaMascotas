-- La API pública de Supabase (PostgREST) expone automáticamente cada tabla
-- del schema "public" a través de https://<proyecto>.supabase.co/rest/v1/...,
-- protegida únicamente por Row Level Security. Esta app nunca usa esa API
-- (Prisma se conecta directo por DATABASE_URL con un rol que además tiene
-- rolbypassrls=true), pero al estar deshabilitado RLS, cualquiera con la
-- clave pública "anon" podía leer o escribir cualquier fila de cualquier
-- tabla, incluidos los access_token/refresh_token de Google en "Account".
--
-- Activar RLS sin políticas cierra esa API por completo (default-deny) sin
-- afectar a la app: el rol que usa Prisma bypassea RLS y además es dueño de
-- las tablas.
ALTER TABLE public."User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Account" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Session" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."VerificationToken" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Product" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Order" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."OrderItem" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."StoreSettings" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."JobApplication" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Category" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."CustomOrderRequest" ENABLE ROW LEVEL SECURITY;
