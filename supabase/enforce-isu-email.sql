create or replace function public.enforce_isu_email_domain()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.email is null or lower(new.email) !~ '^[a-z0-9]+\.[a-z0-9]+_cyn@isu\.edu\.ph$' then
    raise exception 'Use the email format name.surname_cyn@isu.edu.ph';
  end if;

  return new;
end;
$$;

drop trigger if exists enforce_isu_email_domain on auth.users;

create trigger enforce_isu_email_domain
before insert or update on auth.users
for each row
execute function public.enforce_isu_email_domain();
