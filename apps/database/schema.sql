--
-- PostgreSQL database dump
--

-- Dumped from database version 16.3 (Debian 16.3-1.pgdg120+1)
-- Dumped by pg_dump version 16.3 (Debian 16.3-1.pgdg120+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: associate_files; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA associate_files;


ALTER SCHEMA associate_files OWNER TO postgres;

--
-- Name: auth; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA auth;


ALTER SCHEMA auth OWNER TO postgres;

--
-- Name: bookkeeping; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA bookkeeping;


ALTER SCHEMA bookkeeping OWNER TO postgres;

--
-- Name: payroll; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA payroll;


ALTER SCHEMA payroll OWNER TO postgres;

--
-- Name: portal; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA portal;


ALTER SCHEMA portal OWNER TO postgres;

--
-- Name: taskboard; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA taskboard;


ALTER SCHEMA taskboard OWNER TO postgres;

--
-- Name: access code; Type: TYPE; Schema: auth; Owner: postgres
--

CREATE TYPE auth."access code" AS ENUM (
    'ACCESS_EXAMPLE',
    'ACCESS_EXAMPLE2'
);


ALTER TYPE auth."access code" OWNER TO postgres;

--
-- Name: punch_type; Type: TYPE; Schema: payroll; Owner: postgres
--

CREATE TYPE payroll.punch_type AS ENUM (
    'in',
    'out',
    'meal',
    'paid'
);


ALTER TYPE payroll.punch_type OWNER TO postgres;

--
-- Name: warning_level; Type: TYPE; Schema: payroll; Owner: postgres
--

CREATE TYPE payroll.warning_level AS ENUM (
    '!',
    '!!',
    '!!!'
);


ALTER TYPE payroll.warning_level OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: addresses; Type: TABLE; Schema: associate_files; Owner: postgres
--

CREATE TABLE associate_files.addresses (
    associate_id uuid NOT NULL,
    formatted character varying NOT NULL,
    place_id_google character varying NOT NULL
);


ALTER TABLE associate_files.addresses OWNER TO postgres;

--
-- Name: badges; Type: TABLE; Schema: associate_files; Owner: postgres
--

CREATE TABLE associate_files.badges (
    associate_id uuid NOT NULL,
    company_id uuid NOT NULL,
    branch_id uuid NOT NULL,
    position_id uuid NOT NULL,
    badge_number character varying NOT NULL
);


ALTER TABLE associate_files.badges OWNER TO postgres;

--
-- Name: contact_information; Type: TABLE; Schema: associate_files; Owner: postgres
--

CREATE TABLE associate_files.contact_information (
    associate_id uuid NOT NULL,
    phone character varying NOT NULL,
    email character varying NOT NULL
);


ALTER TABLE associate_files.contact_information OWNER TO postgres;

--
-- Name: direct_deposit_accounts; Type: TABLE; Schema: associate_files; Owner: postgres
--

CREATE TABLE associate_files.direct_deposit_accounts (
    associate_id uuid NOT NULL,
    transit character varying(5) NOT NULL,
    institution character varying(3) NOT NULL,
    account character varying(12) NOT NULL
);


ALTER TABLE associate_files.direct_deposit_accounts OWNER TO postgres;

--
-- Name: employment; Type: TABLE; Schema: associate_files; Owner: postgres
--

CREATE TABLE associate_files.employment (
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


ALTER TABLE associate_files.employment OWNER TO postgres;

--
-- Name: social_insurance_numbers; Type: TABLE; Schema: associate_files; Owner: postgres
--

CREATE TABLE associate_files.social_insurance_numbers (
    associate_id uuid NOT NULL,
    sin character varying(9) NOT NULL,
    expiry date
);


ALTER TABLE associate_files.social_insurance_numbers OWNER TO postgres;

--
-- Name: permissions; Type: TABLE; Schema: auth; Owner: postgres
--

CREATE TABLE auth.permissions (
    app character varying NOT NULL,
    category character varying NOT NULL,
    sub_category character varying,
    code character varying NOT NULL,
    type character varying NOT NULL,
    title character varying
);


ALTER TABLE auth.permissions OWNER TO postgres;

--
-- Name: sessions; Type: TABLE; Schema: auth; Owner: postgres
--

CREATE TABLE auth.sessions (
    uuid character varying NOT NULL,
    token character varying NOT NULL,
    "timestamp" timestamp with time zone DEFAULT now() NOT NULL,
    ip_address character varying NOT NULL,
    user_agent character varying NOT NULL,
    valid boolean DEFAULT true NOT NULL,
    expiry_date date NOT NULL
);


ALTER TABLE auth.sessions OWNER TO postgres;

--
-- Name: user_permissions; Type: TABLE; Schema: auth; Owner: postgres
--

CREATE TABLE auth.user_permissions (
    "user" uuid NOT NULL,
    permissions character varying DEFAULT ARRAY[]::character varying[] NOT NULL
);


ALTER TABLE auth.user_permissions OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: auth; Owner: postgres
--

CREATE TABLE auth.users (
    email character varying NOT NULL,
    first_name character varying NOT NULL,
    last_name character varying NOT NULL,
    password character varying NOT NULL,
    uuid uuid DEFAULT gen_random_uuid() NOT NULL
);


ALTER TABLE auth.users OWNER TO postgres;

--
-- Name: accounts; Type: TABLE; Schema: bookkeeping; Owner: postgres
--

CREATE TABLE bookkeeping.accounts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    company_id uuid NOT NULL,
    name character varying NOT NULL,
    type character varying NOT NULL,
    number character varying NOT NULL,
    balance money DEFAULT '$0.00'::money NOT NULL,
    groups character varying[]
);


ALTER TABLE bookkeeping.accounts OWNER TO postgres;

--
-- Name: ledger; Type: TABLE; Schema: bookkeeping; Owner: postgres
--

CREATE TABLE bookkeeping.ledger (
    id uuid NOT NULL,
    transaction_date date NOT NULL,
    transaction_id uuid NOT NULL,
    account_id uuid NOT NULL,
    amount money NOT NULL,
    is_credit boolean DEFAULT false NOT NULL
);


ALTER TABLE bookkeeping.ledger OWNER TO postgres;

--
-- Name: tax_codes; Type: TABLE; Schema: bookkeeping; Owner: postgres
--

CREATE TABLE bookkeeping.tax_codes (
    code character varying NOT NULL,
    location character varying,
    description character varying NOT NULL,
    rate double precision NOT NULL
);


ALTER TABLE bookkeeping.tax_codes OWNER TO postgres;

--
-- Name: transactions; Type: TABLE; Schema: bookkeeping; Owner: postgres
--

CREATE TABLE bookkeeping.transactions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    account_id uuid NOT NULL,
    date date NOT NULL,
    reference_id character varying,
    description character varying,
    amount money NOT NULL,
    payee_id character varying
);


ALTER TABLE bookkeeping.transactions OWNER TO postgres;

--
-- Name: associates; Type: TABLE; Schema: payroll; Owner: postgres
--

CREATE TABLE payroll.associates (
    associate_id uuid DEFAULT gen_random_uuid() NOT NULL,
    first_name character varying NOT NULL,
    last_name character varying NOT NULL,
    company_id uuid NOT NULL,
    branch_id uuid NOT NULL,
    position_id uuid NOT NULL,
    date_added date DEFAULT now() NOT NULL,
    badge_number character varying NOT NULL
);


ALTER TABLE payroll.associates OWNER TO postgres;

--
-- Name: positions; Type: TABLE; Schema: payroll; Owner: postgres
--

CREATE TABLE payroll.positions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying NOT NULL,
    company_id uuid NOT NULL,
    default_permissions character varying[] DEFAULT ARRAY[]::character varying[] NOT NULL
);


ALTER TABLE payroll.positions OWNER TO postgres;

--
-- Name: provincial_data; Type: TABLE; Schema: payroll; Owner: postgres
--

CREATE TABLE payroll.provincial_data (
    name character varying NOT NULL,
    code character varying NOT NULL,
    min_hourly_wage money NOT NULL
);


ALTER TABLE payroll.provincial_data OWNER TO postgres;

--
-- Name: punches; Type: TABLE; Schema: payroll; Owner: postgres
--

CREATE TABLE payroll.punches (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    associate_id uuid NOT NULL,
    branch_id uuid NOT NULL,
    type payroll.punch_type NOT NULL,
    modification_request time without time zone,
    "timestamp" timestamp with time zone DEFAULT now() NOT NULL,
    locked boolean DEFAULT false NOT NULL
);


ALTER TABLE payroll.punches OWNER TO postgres;

--
-- Name: warnings; Type: TABLE; Schema: payroll; Owner: postgres
--

CREATE TABLE payroll.warnings (
    associate_id uuid NOT NULL,
    level payroll.warning_level DEFAULT '!'::payroll.warning_level NOT NULL,
    title character varying NOT NULL,
    message text
);


ALTER TABLE payroll.warnings OWNER TO postgres;

--
-- Name: accounts; Type: TABLE; Schema: portal; Owner: postgres
--

CREATE TABLE portal.accounts (
    user_id uuid NOT NULL,
    company_id uuid NOT NULL,
    branch_ids uuid[] NOT NULL,
    admin boolean DEFAULT false NOT NULL
);


ALTER TABLE portal.accounts OWNER TO postgres;

--
-- Name: company_registration_keys; Type: TABLE; Schema: portal; Owner: postgres
--

CREATE TABLE portal.company_registration_keys (
    key character varying NOT NULL,
    valid boolean DEFAULT true NOT NULL
);


ALTER TABLE portal.company_registration_keys OWNER TO postgres;

--
-- Name: generated_passwords; Type: TABLE; Schema: portal; Owner: postgres
--

CREATE TABLE portal.generated_passwords (
    user_id uuid NOT NULL,
    password character varying NOT NULL
);


ALTER TABLE portal.generated_passwords OWNER TO postgres;

--
-- Name: branches; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.branches (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    number character varying NOT NULL,
    name character varying NOT NULL,
    company_id uuid NOT NULL
);


ALTER TABLE public.branches OWNER TO postgres;

--
-- Name: chart_of_accounts; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.chart_of_accounts AS
SELECT
    NULL::uuid AS company_id,
    NULL::uuid AS account_id,
    NULL::character varying AS name,
    NULL::character varying[] AS groups,
    NULL::money AS balance;


ALTER VIEW public.chart_of_accounts OWNER TO postgres;

--
-- Name: companies; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.companies (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying NOT NULL,
    domain character varying NOT NULL,
    address character varying,
    place_id_google character varying,
    email character varying
);


ALTER TABLE public.companies OWNER TO postgres;

--
-- Name: databasechangelog; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.databasechangelog (
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


ALTER TABLE public.databasechangelog OWNER TO postgres;

--
-- Name: databasechangeloglock; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.databasechangeloglock (
    id integer NOT NULL,
    locked boolean NOT NULL,
    lockgranted timestamp without time zone,
    lockedby character varying(255)
);


ALTER TABLE public.databasechangeloglock OWNER TO postgres;

--
-- Name: accounts; Type: TABLE; Schema: taskboard; Owner: postgres
--

CREATE TABLE taskboard.accounts (
    user_id uuid NOT NULL,
    branch_id uuid NOT NULL
);


ALTER TABLE taskboard.accounts OWNER TO postgres;

--
-- Name: addresses address_pkey; Type: CONSTRAINT; Schema: associate_files; Owner: postgres
--

ALTER TABLE ONLY associate_files.addresses
    ADD CONSTRAINT address_pkey PRIMARY KEY (associate_id);


--
-- Name: contact_information contact_information_pkey; Type: CONSTRAINT; Schema: associate_files; Owner: postgres
--

ALTER TABLE ONLY associate_files.contact_information
    ADD CONSTRAINT contact_information_pkey PRIMARY KEY (associate_id);


--
-- Name: direct_deposit_accounts direct_deposit_accounts_pkey; Type: CONSTRAINT; Schema: associate_files; Owner: postgres
--

ALTER TABLE ONLY associate_files.direct_deposit_accounts
    ADD CONSTRAINT direct_deposit_accounts_pkey PRIMARY KEY (associate_id);


--
-- Name: employment employment_pkey; Type: CONSTRAINT; Schema: associate_files; Owner: postgres
--

ALTER TABLE ONLY associate_files.employment
    ADD CONSTRAINT employment_pkey PRIMARY KEY (associate_id);


--
-- Name: social_insurance_numbers sins_pkey; Type: CONSTRAINT; Schema: associate_files; Owner: postgres
--

ALTER TABLE ONLY associate_files.social_insurance_numbers
    ADD CONSTRAINT sins_pkey PRIMARY KEY (associate_id);


--
-- Name: permissions permissions_pkey; Type: CONSTRAINT; Schema: auth; Owner: postgres
--

ALTER TABLE ONLY auth.permissions
    ADD CONSTRAINT permissions_pkey PRIMARY KEY (code);


--
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: auth; Owner: postgres
--

ALTER TABLE ONLY auth.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (token);


--
-- Name: user_permissions user_access_pkey; Type: CONSTRAINT; Schema: auth; Owner: postgres
--

ALTER TABLE ONLY auth.user_permissions
    ADD CONSTRAINT user_access_pkey PRIMARY KEY ("user");


--
-- Name: users user_email; Type: CONSTRAINT; Schema: auth; Owner: postgres
--

ALTER TABLE ONLY auth.users
    ADD CONSTRAINT user_email UNIQUE (email);


--
-- Name: accounts accounts_pkey; Type: CONSTRAINT; Schema: bookkeeping; Owner: postgres
--

ALTER TABLE ONLY bookkeeping.accounts
    ADD CONSTRAINT accounts_pkey PRIMARY KEY (id);


--
-- Name: ledger ledger_pkey; Type: CONSTRAINT; Schema: bookkeeping; Owner: postgres
--

ALTER TABLE ONLY bookkeeping.ledger
    ADD CONSTRAINT ledger_pkey PRIMARY KEY (id);


--
-- Name: tax_codes tax_codes_pkey; Type: CONSTRAINT; Schema: bookkeeping; Owner: postgres
--

ALTER TABLE ONLY bookkeeping.tax_codes
    ADD CONSTRAINT tax_codes_pkey PRIMARY KEY (code);


--
-- Name: transactions transactions_pkey; Type: CONSTRAINT; Schema: bookkeeping; Owner: postgres
--

ALTER TABLE ONLY bookkeeping.transactions
    ADD CONSTRAINT transactions_pkey PRIMARY KEY (id);


--
-- Name: associates associates_pkey; Type: CONSTRAINT; Schema: payroll; Owner: postgres
--

ALTER TABLE ONLY payroll.associates
    ADD CONSTRAINT associates_pkey PRIMARY KEY (associate_id);


--
-- Name: positions position_per_company; Type: CONSTRAINT; Schema: payroll; Owner: postgres
--

ALTER TABLE ONLY payroll.positions
    ADD CONSTRAINT position_per_company UNIQUE (company_id, name);


--
-- Name: positions positions_pkey; Type: CONSTRAINT; Schema: payroll; Owner: postgres
--

ALTER TABLE ONLY payroll.positions
    ADD CONSTRAINT positions_pkey PRIMARY KEY (id);


--
-- Name: provincial_data provincial_data_pkey; Type: CONSTRAINT; Schema: payroll; Owner: postgres
--

ALTER TABLE ONLY payroll.provincial_data
    ADD CONSTRAINT provincial_data_pkey PRIMARY KEY (name);


--
-- Name: punches punches_pkey; Type: CONSTRAINT; Schema: payroll; Owner: postgres
--

ALTER TABLE ONLY payroll.punches
    ADD CONSTRAINT punches_pkey PRIMARY KEY (id);


--
-- Name: accounts accounts_pkey; Type: CONSTRAINT; Schema: portal; Owner: postgres
--

ALTER TABLE ONLY portal.accounts
    ADD CONSTRAINT accounts_pkey PRIMARY KEY (user_id);


--
-- Name: company_registration_keys company_registration_keys_pkey; Type: CONSTRAINT; Schema: portal; Owner: postgres
--

ALTER TABLE ONLY portal.company_registration_keys
    ADD CONSTRAINT company_registration_keys_pkey PRIMARY KEY (key);


--
-- Name: generated_passwords generated_passwords_pkey; Type: CONSTRAINT; Schema: portal; Owner: postgres
--

ALTER TABLE ONLY portal.generated_passwords
    ADD CONSTRAINT generated_passwords_pkey PRIMARY KEY (user_id);


--
-- Name: branches branches_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.branches
    ADD CONSTRAINT branches_pkey PRIMARY KEY (id);


--
-- Name: companies companies_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.companies
    ADD CONSTRAINT companies_pkey PRIMARY KEY (id);


--
-- Name: databasechangeloglock databasechangeloglock_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.databasechangeloglock
    ADD CONSTRAINT databasechangeloglock_pkey PRIMARY KEY (id);


--
-- Name: branches store_number_in_company; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.branches
    ADD CONSTRAINT store_number_in_company UNIQUE (number, company_id);


--
-- Name: accounts accounts_pkey; Type: CONSTRAINT; Schema: taskboard; Owner: postgres
--

ALTER TABLE ONLY taskboard.accounts
    ADD CONSTRAINT accounts_pkey PRIMARY KEY (branch_id, user_id);


--
-- Name: chart_of_accounts _RETURN; Type: RULE; Schema: public; Owner: postgres
--

CREATE OR REPLACE VIEW public.chart_of_accounts AS
 SELECT ac.company_id,
    ac.id AS account_id,
    ac.name,
    ac.groups,
    sum(lg.amount) AS balance
   FROM ((bookkeeping.ledger lg
     JOIN bookkeeping.transactions tr ON ((lg.transaction_id = tr.id)))
     JOIN bookkeeping.accounts ac ON ((lg.account_id = ac.id)))
  GROUP BY ac.id;


--
-- Name: ledger account; Type: FK CONSTRAINT; Schema: bookkeeping; Owner: postgres
--

ALTER TABLE ONLY bookkeeping.ledger
    ADD CONSTRAINT account FOREIGN KEY (account_id) REFERENCES bookkeeping.accounts(id);


--
-- Name: transactions account; Type: FK CONSTRAINT; Schema: bookkeeping; Owner: postgres
--

ALTER TABLE ONLY bookkeeping.transactions
    ADD CONSTRAINT account FOREIGN KEY (account_id) REFERENCES bookkeeping.accounts(id) NOT VALID;


--
-- Name: ledger transaction; Type: FK CONSTRAINT; Schema: bookkeeping; Owner: postgres
--

ALTER TABLE ONLY bookkeeping.ledger
    ADD CONSTRAINT transaction FOREIGN KEY (transaction_id) REFERENCES bookkeeping.transactions(id);


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: pg_database_owner
--

GRANT USAGE ON SCHEMA public TO postgres;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: associate_files; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA associate_files GRANT SELECT ON TABLES TO postgres;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: auth; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA auth GRANT SELECT ON TABLES TO postgres;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: bookkeeping; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA bookkeeping GRANT SELECT ON TABLES TO postgres;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: payroll; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA payroll GRANT SELECT ON TABLES TO postgres;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: portal; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA portal GRANT SELECT ON TABLES TO postgres;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT SELECT ON TABLES TO postgres;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: taskboard; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA taskboard GRANT SELECT ON TABLES TO postgres;


--
-- PostgreSQL database dump complete
--

