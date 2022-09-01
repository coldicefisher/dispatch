CREATE CUSTOM INDEX business_profiles_by_full_name_idx ON dispatch_users.business_profiles (full_name) USING 'org.apache.cassandra.index.sasi.SASIIndex' WITH OPTIONS = {'analyzer_class': 'org.apache.cassandra.index.sasi.analyzer.NonTokenizingAnalyzer', 'case_sensitive': 'false', 'mode': 'CONTAINS'};

CREATE TABLE dispatch_users.business_profiles (
    business_name text,
    profile_id uuid,
    association_email text,
    deleted boolean,
    first_name text,
    full_name text,
    has_login boolean,
    last_name text,
    middle_name text,
    profile_picture text,
    suffix text,
    permissions set<text>,
    PRIMARY KEY ((business_name), (profile_id))

