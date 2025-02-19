PGDMP  &                    |           tb_db    16.2 (Debian 16.2-1.pgdg120+2)    16.0 O    �           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            �           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            �           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            �           1262    16384    tb_db    DATABASE     p   CREATE DATABASE tb_db WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.utf8';
    DROP DATABASE tb_db;
                postgres    false                        2615    16385    associate_files    SCHEMA        CREATE SCHEMA associate_files;
    DROP SCHEMA associate_files;
                postgres    false                        2615    16386    auth    SCHEMA        CREATE SCHEMA auth;
    DROP SCHEMA auth;
                postgres    false                        2615    16387    bookkeeping    SCHEMA        CREATE SCHEMA bookkeeping;
    DROP SCHEMA bookkeeping;
                postgres    false                        2615    16388    payroll    SCHEMA        CREATE SCHEMA payroll;
    DROP SCHEMA payroll;
                postgres    false            	            2615    16389    portal    SCHEMA        CREATE SCHEMA portal;
    DROP SCHEMA portal;
                postgres    false            �           0    0    SCHEMA public    ACL     *   GRANT USAGE ON SCHEMA public TO postgres;
                   pg_database_owner    false    11            
            2615    16390 	   taskboard    SCHEMA        CREATE SCHEMA taskboard;
    DROP SCHEMA taskboard;
                postgres    false            i           1247    16392    access code    TYPE     X   CREATE TYPE auth."access code" AS ENUM (
    'ACCESS_EXAMPLE',
    'ACCESS_EXAMPLE2'
);
    DROP TYPE auth."access code";
       auth          postgres    false    6            l           1247    16398 
   punch_type    TYPE     X   CREATE TYPE payroll.punch_type AS ENUM (
    'in',
    'out',
    'meal',
    'paid'
);
    DROP TYPE payroll.punch_type;
       payroll          postgres    false    8            o           1247    16408    warning_level    TYPE     L   CREATE TYPE payroll.warning_level AS ENUM (
    '!',
    '!!',
    '!!!'
);
 !   DROP TYPE payroll.warning_level;
       payroll          postgres    false    8            �            1259    16415 	   addresses    TABLE     �   CREATE TABLE associate_files.addresses (
    associate_id uuid NOT NULL,
    formatted character varying NOT NULL,
    place_id_google character varying NOT NULL
);
 &   DROP TABLE associate_files.addresses;
       associate_files         heap    postgres    false    5            �            1259    16643    badges    TABLE     �   CREATE TABLE associate_files.badges (
    associate_id uuid NOT NULL,
    company_id uuid NOT NULL,
    branch_id uuid NOT NULL,
    position_id uuid NOT NULL,
    badge_number character varying NOT NULL
);
 #   DROP TABLE associate_files.badges;
       associate_files         heap    postgres    false    5            �            1259    16628    contact_information    TABLE     �   CREATE TABLE associate_files.contact_information (
    associate_id uuid NOT NULL,
    phone character varying NOT NULL,
    email character varying NOT NULL
);
 0   DROP TABLE associate_files.contact_information;
       associate_files         heap    postgres    false    5            �            1259    16420    direct_deposit_accounts    TABLE     �   CREATE TABLE associate_files.direct_deposit_accounts (
    associate_id uuid NOT NULL,
    transit character varying(5) NOT NULL,
    institution character varying(3) NOT NULL,
    account character varying(12) NOT NULL
);
 4   DROP TABLE associate_files.direct_deposit_accounts;
       associate_files         heap    postgres    false    5            �            1259    16635 
   employment    TABLE     y  CREATE TABLE associate_files.employment (
    associate_id uuid NOT NULL,
    company_id uuid NOT NULL,
    branch_id uuid NOT NULL,
    position_id uuid NOT NULL,
    employment_type character varying NOT NULL,
    province_code character varying NOT NULL,
    salary_structure character varying NOT NULL,
    rate money NOT NULL,
    hire_date date DEFAULT now() NOT NULL
);
 '   DROP TABLE associate_files.employment;
       associate_files         heap    postgres    false    5            �            1259    16423    social_insurance_numbers    TABLE     �   CREATE TABLE associate_files.social_insurance_numbers (
    associate_id uuid NOT NULL,
    sin character varying(9) NOT NULL,
    expiry date
);
 5   DROP TABLE associate_files.social_insurance_numbers;
       associate_files         heap    postgres    false    5            �            1259    16426    permissions    TABLE     �   CREATE TABLE auth.permissions (
    app character varying NOT NULL,
    category character varying NOT NULL,
    sub_category character varying,
    code character varying NOT NULL,
    type character varying NOT NULL,
    title character varying
);
    DROP TABLE auth.permissions;
       auth         heap    postgres    false    6            �            1259    16431    sessions    TABLE     I  CREATE TABLE auth.sessions (
    uuid character varying NOT NULL,
    token character varying NOT NULL,
    "timestamp" timestamp with time zone DEFAULT now() NOT NULL,
    ip_address character varying NOT NULL,
    user_agent character varying NOT NULL,
    valid boolean DEFAULT true NOT NULL,
    expiry_date date NOT NULL
);
    DROP TABLE auth.sessions;
       auth         heap    postgres    false    6            �            1259    16438    user_permissions    TABLE     �   CREATE TABLE auth.user_permissions (
    "user" uuid NOT NULL,
    permissions character varying DEFAULT ARRAY[]::character varying[] NOT NULL
);
 "   DROP TABLE auth.user_permissions;
       auth         heap    postgres    false    6            �            1259    16444    users    TABLE     �   CREATE TABLE auth.users (
    email character varying NOT NULL,
    first_name character varying NOT NULL,
    last_name character varying NOT NULL,
    password character varying NOT NULL,
    uuid uuid DEFAULT gen_random_uuid() NOT NULL
);
    DROP TABLE auth.users;
       auth         heap    postgres    false    6            �            1259    16450    accounts    TABLE     8  CREATE TABLE bookkeeping.accounts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    company_id uuid NOT NULL,
    name character varying NOT NULL,
    type character varying NOT NULL,
    number character varying NOT NULL,
    balance money DEFAULT '$0.00'::money NOT NULL,
    groups character varying[]
);
 !   DROP TABLE bookkeeping.accounts;
       bookkeeping         heap    postgres    false    7            �            1259    16457    ledger    TABLE     �   CREATE TABLE bookkeeping.ledger (
    id uuid NOT NULL,
    transaction_date date NOT NULL,
    transaction_id uuid NOT NULL,
    account_id uuid NOT NULL,
    amount money NOT NULL,
    is_credit boolean DEFAULT false NOT NULL
);
    DROP TABLE bookkeeping.ledger;
       bookkeeping         heap    postgres    false    7            �            1259    16461 	   tax_codes    TABLE     �   CREATE TABLE bookkeeping.tax_codes (
    code character varying NOT NULL,
    location character varying,
    description character varying NOT NULL,
    rate double precision NOT NULL
);
 "   DROP TABLE bookkeeping.tax_codes;
       bookkeeping         heap    postgres    false    7            �            1259    16466    transactions    TABLE       CREATE TABLE bookkeeping.transactions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    account_id uuid NOT NULL,
    date date NOT NULL,
    reference_id character varying,
    description character varying,
    amount money NOT NULL,
    payee_id character varying
);
 %   DROP TABLE bookkeeping.transactions;
       bookkeeping         heap    postgres    false    7            �            1259    16472 
   associates    TABLE     f  CREATE TABLE payroll.associates (
    associate_id uuid DEFAULT gen_random_uuid() NOT NULL,
    first_name character varying NOT NULL,
    last_name character varying NOT NULL,
    company_id uuid NOT NULL,
    branch_id uuid NOT NULL,
    position_id uuid NOT NULL,
    date_added date DEFAULT now() NOT NULL,
    badge_number character varying NOT NULL
);
    DROP TABLE payroll.associates;
       payroll         heap    postgres    false    8            �            1259    16479 	   positions    TABLE     �   CREATE TABLE payroll.positions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying NOT NULL,
    company_id uuid NOT NULL,
    default_permissions character varying[] DEFAULT ARRAY[]::character varying[] NOT NULL
);
    DROP TABLE payroll.positions;
       payroll         heap    postgres    false    8            �            1259    16486    provincial_data    TABLE     �   CREATE TABLE payroll.provincial_data (
    name character varying NOT NULL,
    code character varying NOT NULL,
    min_hourly_wage money NOT NULL
);
 $   DROP TABLE payroll.provincial_data;
       payroll         heap    postgres    false    8            �            1259    16491    punches    TABLE     Q  CREATE TABLE payroll.punches (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    associate_id uuid NOT NULL,
    branch_id uuid NOT NULL,
    type payroll.punch_type NOT NULL,
    modification_request time without time zone,
    "timestamp" timestamp with time zone DEFAULT now() NOT NULL,
    locked boolean DEFAULT false NOT NULL
);
    DROP TABLE payroll.punches;
       payroll         heap    postgres    false    8    876            �            1259    16497    warnings    TABLE     �   CREATE TABLE payroll.warnings (
    associate_id uuid NOT NULL,
    level payroll.warning_level DEFAULT '!'::payroll.warning_level NOT NULL,
    title character varying NOT NULL,
    message text
);
    DROP TABLE payroll.warnings;
       payroll         heap    postgres    false    879    8    879            �            1259    16503    accounts    TABLE     �   CREATE TABLE portal.accounts (
    user_id uuid NOT NULL,
    company_id uuid NOT NULL,
    branch_ids uuid[] NOT NULL,
    admin boolean DEFAULT false NOT NULL
);
    DROP TABLE portal.accounts;
       portal         heap    postgres    false    9            �            1259    16509    company_registration_keys    TABLE        CREATE TABLE portal.company_registration_keys (
    key character varying NOT NULL,
    valid boolean DEFAULT true NOT NULL
);
 -   DROP TABLE portal.company_registration_keys;
       portal         heap    postgres    false    9            �            1259    16515    generated_passwords    TABLE     p   CREATE TABLE portal.generated_passwords (
    user_id uuid NOT NULL,
    password character varying NOT NULL
);
 '   DROP TABLE portal.generated_passwords;
       portal         heap    postgres    false    9            �            1259    16520    branches    TABLE     �   CREATE TABLE public.branches (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    number character varying NOT NULL,
    name character varying NOT NULL,
    company_id uuid NOT NULL
);
    DROP TABLE public.branches;
       public         heap    postgres    false            �            1259    16526    chart_of_accounts    VIEW     �   CREATE VIEW public.chart_of_accounts AS
SELECT
    NULL::uuid AS company_id,
    NULL::uuid AS account_id,
    NULL::character varying AS name,
    NULL::character varying[] AS groups,
    NULL::money AS balance;
 $   DROP VIEW public.chart_of_accounts;
       public          postgres    false            �            1259    16530 	   companies    TABLE       CREATE TABLE public.companies (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying NOT NULL,
    domain character varying NOT NULL,
    address character varying,
    place_id_google character varying,
    email character varying
);
    DROP TABLE public.companies;
       public         heap    postgres    false            �            1259    16536    databasechangelog    TABLE     Y  CREATE TABLE public.databasechangelog (
    id character varying(255) NOT NULL,
    author character varying(255) NOT NULL,
    filename character varying(255) NOT NULL,
    dateexecuted timestamp without time zone NOT NULL,
    orderexecuted integer NOT NULL,
    exectype character varying(10) NOT NULL,
    md5sum character varying(35),
    description character varying(255),
    comments character varying(255),
    tag character varying(255),
    liquibase character varying(20),
    contexts character varying(255),
    labels character varying(255),
    deployment_id character varying(10)
);
 %   DROP TABLE public.databasechangelog;
       public         heap    postgres    false            �            1259    16541    databasechangeloglock    TABLE     �   CREATE TABLE public.databasechangeloglock (
    id integer NOT NULL,
    locked boolean NOT NULL,
    lockgranted timestamp without time zone,
    lockedby character varying(255)
);
 )   DROP TABLE public.databasechangeloglock;
       public         heap    postgres    false            �            1259    16544    accounts    TABLE     \   CREATE TABLE taskboard.accounts (
    user_id uuid NOT NULL,
    branch_id uuid NOT NULL
);
    DROP TABLE taskboard.accounts;
    	   taskboard         heap    postgres    false    10                       2606    16548    addresses address_pkey 
   CONSTRAINT     g   ALTER TABLE ONLY associate_files.addresses
    ADD CONSTRAINT address_pkey PRIMARY KEY (associate_id);
 I   ALTER TABLE ONLY associate_files.addresses DROP CONSTRAINT address_pkey;
       associate_files            postgres    false    221            J           2606    16634 ,   contact_information contact_information_pkey 
   CONSTRAINT     }   ALTER TABLE ONLY associate_files.contact_information
    ADD CONSTRAINT contact_information_pkey PRIMARY KEY (associate_id);
 _   ALTER TABLE ONLY associate_files.contact_information DROP CONSTRAINT contact_information_pkey;
       associate_files            postgres    false    246                       2606    16550 4   direct_deposit_accounts direct_deposit_accounts_pkey 
   CONSTRAINT     �   ALTER TABLE ONLY associate_files.direct_deposit_accounts
    ADD CONSTRAINT direct_deposit_accounts_pkey PRIMARY KEY (associate_id);
 g   ALTER TABLE ONLY associate_files.direct_deposit_accounts DROP CONSTRAINT direct_deposit_accounts_pkey;
       associate_files            postgres    false    222            L           2606    16642    employment employment_pkey 
   CONSTRAINT     k   ALTER TABLE ONLY associate_files.employment
    ADD CONSTRAINT employment_pkey PRIMARY KEY (associate_id);
 M   ALTER TABLE ONLY associate_files.employment DROP CONSTRAINT employment_pkey;
       associate_files            postgres    false    247                       2606    16552 "   social_insurance_numbers sins_pkey 
   CONSTRAINT     s   ALTER TABLE ONLY associate_files.social_insurance_numbers
    ADD CONSTRAINT sins_pkey PRIMARY KEY (associate_id);
 U   ALTER TABLE ONLY associate_files.social_insurance_numbers DROP CONSTRAINT sins_pkey;
       associate_files            postgres    false    223                        2606    16554    permissions permissions_pkey 
   CONSTRAINT     Z   ALTER TABLE ONLY auth.permissions
    ADD CONSTRAINT permissions_pkey PRIMARY KEY (code);
 D   ALTER TABLE ONLY auth.permissions DROP CONSTRAINT permissions_pkey;
       auth            postgres    false    224            "           2606    16556    sessions sessions_pkey 
   CONSTRAINT     U   ALTER TABLE ONLY auth.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (token);
 >   ALTER TABLE ONLY auth.sessions DROP CONSTRAINT sessions_pkey;
       auth            postgres    false    225            $           2606    16558 !   user_permissions user_access_pkey 
   CONSTRAINT     a   ALTER TABLE ONLY auth.user_permissions
    ADD CONSTRAINT user_access_pkey PRIMARY KEY ("user");
 I   ALTER TABLE ONLY auth.user_permissions DROP CONSTRAINT user_access_pkey;
       auth            postgres    false    226            &           2606    16560    users user_email 
   CONSTRAINT     J   ALTER TABLE ONLY auth.users
    ADD CONSTRAINT user_email UNIQUE (email);
 8   ALTER TABLE ONLY auth.users DROP CONSTRAINT user_email;
       auth            postgres    false    227            (           2606    16562    accounts accounts_pkey 
   CONSTRAINT     Y   ALTER TABLE ONLY bookkeeping.accounts
    ADD CONSTRAINT accounts_pkey PRIMARY KEY (id);
 E   ALTER TABLE ONLY bookkeeping.accounts DROP CONSTRAINT accounts_pkey;
       bookkeeping            postgres    false    228            *           2606    16564    ledger ledger_pkey 
   CONSTRAINT     U   ALTER TABLE ONLY bookkeeping.ledger
    ADD CONSTRAINT ledger_pkey PRIMARY KEY (id);
 A   ALTER TABLE ONLY bookkeeping.ledger DROP CONSTRAINT ledger_pkey;
       bookkeeping            postgres    false    229            ,           2606    16566    tax_codes tax_codes_pkey 
   CONSTRAINT     ]   ALTER TABLE ONLY bookkeeping.tax_codes
    ADD CONSTRAINT tax_codes_pkey PRIMARY KEY (code);
 G   ALTER TABLE ONLY bookkeeping.tax_codes DROP CONSTRAINT tax_codes_pkey;
       bookkeeping            postgres    false    230            .           2606    16568    transactions transactions_pkey 
   CONSTRAINT     a   ALTER TABLE ONLY bookkeeping.transactions
    ADD CONSTRAINT transactions_pkey PRIMARY KEY (id);
 M   ALTER TABLE ONLY bookkeeping.transactions DROP CONSTRAINT transactions_pkey;
       bookkeeping            postgres    false    231            0           2606    16570    associates associates_pkey 
   CONSTRAINT     c   ALTER TABLE ONLY payroll.associates
    ADD CONSTRAINT associates_pkey PRIMARY KEY (associate_id);
 E   ALTER TABLE ONLY payroll.associates DROP CONSTRAINT associates_pkey;
       payroll            postgres    false    232            2           2606    16572    positions position_per_company 
   CONSTRAINT     f   ALTER TABLE ONLY payroll.positions
    ADD CONSTRAINT position_per_company UNIQUE (company_id, name);
 I   ALTER TABLE ONLY payroll.positions DROP CONSTRAINT position_per_company;
       payroll            postgres    false    233    233            4           2606    16574    positions positions_pkey 
   CONSTRAINT     W   ALTER TABLE ONLY payroll.positions
    ADD CONSTRAINT positions_pkey PRIMARY KEY (id);
 C   ALTER TABLE ONLY payroll.positions DROP CONSTRAINT positions_pkey;
       payroll            postgres    false    233            6           2606    16576 $   provincial_data provincial_data_pkey 
   CONSTRAINT     e   ALTER TABLE ONLY payroll.provincial_data
    ADD CONSTRAINT provincial_data_pkey PRIMARY KEY (name);
 O   ALTER TABLE ONLY payroll.provincial_data DROP CONSTRAINT provincial_data_pkey;
       payroll            postgres    false    234            8           2606    16578    punches punches_pkey 
   CONSTRAINT     S   ALTER TABLE ONLY payroll.punches
    ADD CONSTRAINT punches_pkey PRIMARY KEY (id);
 ?   ALTER TABLE ONLY payroll.punches DROP CONSTRAINT punches_pkey;
       payroll            postgres    false    235            :           2606    16580    accounts accounts_pkey 
   CONSTRAINT     Y   ALTER TABLE ONLY portal.accounts
    ADD CONSTRAINT accounts_pkey PRIMARY KEY (user_id);
 @   ALTER TABLE ONLY portal.accounts DROP CONSTRAINT accounts_pkey;
       portal            postgres    false    237            <           2606    16582 8   company_registration_keys company_registration_keys_pkey 
   CONSTRAINT     w   ALTER TABLE ONLY portal.company_registration_keys
    ADD CONSTRAINT company_registration_keys_pkey PRIMARY KEY (key);
 b   ALTER TABLE ONLY portal.company_registration_keys DROP CONSTRAINT company_registration_keys_pkey;
       portal            postgres    false    238            >           2606    16584 ,   generated_passwords generated_passwords_pkey 
   CONSTRAINT     o   ALTER TABLE ONLY portal.generated_passwords
    ADD CONSTRAINT generated_passwords_pkey PRIMARY KEY (user_id);
 V   ALTER TABLE ONLY portal.generated_passwords DROP CONSTRAINT generated_passwords_pkey;
       portal            postgres    false    239            @           2606    16586    branches branches_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.branches
    ADD CONSTRAINT branches_pkey PRIMARY KEY (id);
 @   ALTER TABLE ONLY public.branches DROP CONSTRAINT branches_pkey;
       public            postgres    false    240            D           2606    16588    companies companies_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public.companies
    ADD CONSTRAINT companies_pkey PRIMARY KEY (id);
 B   ALTER TABLE ONLY public.companies DROP CONSTRAINT companies_pkey;
       public            postgres    false    242            F           2606    16590 0   databasechangeloglock databasechangeloglock_pkey 
   CONSTRAINT     n   ALTER TABLE ONLY public.databasechangeloglock
    ADD CONSTRAINT databasechangeloglock_pkey PRIMARY KEY (id);
 Z   ALTER TABLE ONLY public.databasechangeloglock DROP CONSTRAINT databasechangeloglock_pkey;
       public            postgres    false    244            B           2606    16592     branches store_number_in_company 
   CONSTRAINT     i   ALTER TABLE ONLY public.branches
    ADD CONSTRAINT store_number_in_company UNIQUE (number, company_id);
 J   ALTER TABLE ONLY public.branches DROP CONSTRAINT store_number_in_company;
       public            postgres    false    240    240            H           2606    16594    accounts accounts_pkey 
   CONSTRAINT     g   ALTER TABLE ONLY taskboard.accounts
    ADD CONSTRAINT accounts_pkey PRIMARY KEY (branch_id, user_id);
 C   ALTER TABLE ONLY taskboard.accounts DROP CONSTRAINT accounts_pkey;
    	   taskboard            postgres    false    245    245            �           2618    16529    chart_of_accounts _RETURN    RULE     W  CREATE OR REPLACE VIEW public.chart_of_accounts AS
 SELECT ac.company_id,
    ac.id AS account_id,
    ac.name,
    ac.groups,
    sum(lg.amount) AS balance
   FROM ((bookkeeping.ledger lg
     JOIN bookkeeping.transactions tr ON ((lg.transaction_id = tr.id)))
     JOIN bookkeeping.accounts ac ON ((lg.account_id = ac.id)))
  GROUP BY ac.id;
 �   CREATE OR REPLACE VIEW public.chart_of_accounts AS
SELECT
    NULL::uuid AS company_id,
    NULL::uuid AS account_id,
    NULL::character varying AS name,
    NULL::character varying[] AS groups,
    NULL::money AS balance;
       public          postgres    false    229    229    229    231    3368    228    228    228    228    241            M           2606    16596    ledger account    FK CONSTRAINT     }   ALTER TABLE ONLY bookkeeping.ledger
    ADD CONSTRAINT account FOREIGN KEY (account_id) REFERENCES bookkeeping.accounts(id);
 =   ALTER TABLE ONLY bookkeeping.ledger DROP CONSTRAINT account;
       bookkeeping          postgres    false    229    3368    228            O           2606    16601    transactions account    FK CONSTRAINT     �   ALTER TABLE ONLY bookkeeping.transactions
    ADD CONSTRAINT account FOREIGN KEY (account_id) REFERENCES bookkeeping.accounts(id) NOT VALID;
 C   ALTER TABLE ONLY bookkeeping.transactions DROP CONSTRAINT account;
       bookkeeping          postgres    false    3368    228    231            N           2606    16606    ledger transaction    FK CONSTRAINT     �   ALTER TABLE ONLY bookkeeping.ledger
    ADD CONSTRAINT transaction FOREIGN KEY (transaction_id) REFERENCES bookkeeping.transactions(id);
 A   ALTER TABLE ONLY bookkeeping.ledger DROP CONSTRAINT transaction;
       bookkeeping          postgres    false    229    3374    231            p           826    16611    DEFAULT PRIVILEGES FOR TABLES    DEFAULT ACL     i   ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA associate_files GRANT SELECT ON TABLES TO postgres;
          associate_files          postgres    false    5            q           826    16612    DEFAULT PRIVILEGES FOR TABLES    DEFAULT ACL     ^   ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA auth GRANT SELECT ON TABLES TO postgres;
          auth          postgres    false    6            r           826    16613    DEFAULT PRIVILEGES FOR TABLES    DEFAULT ACL     e   ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA bookkeeping GRANT SELECT ON TABLES TO postgres;
          bookkeeping          postgres    false    7            s           826    16614    DEFAULT PRIVILEGES FOR TABLES    DEFAULT ACL     a   ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA payroll GRANT SELECT ON TABLES TO postgres;
          payroll          postgres    false    8            t           826    16615    DEFAULT PRIVILEGES FOR TABLES    DEFAULT ACL     `   ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA portal GRANT SELECT ON TABLES TO postgres;
          portal          postgres    false    9            u           826    16616    DEFAULT PRIVILEGES FOR TABLES    DEFAULT ACL     `   ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT SELECT ON TABLES TO postgres;
          public          postgres    false            v           826    16617    DEFAULT PRIVILEGES FOR TABLES    DEFAULT ACL     c   ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA taskboard GRANT SELECT ON TABLES TO postgres;
       	   taskboard          postgres    false    10           