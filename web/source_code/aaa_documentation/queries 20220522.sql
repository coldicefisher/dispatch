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
    PRIMARY KEY (business_name, profile_id)
) WITH CLUSTERING ORDER BY (profile_id ASC)
    AND additional_write_policy = '99p'
    AND bloom_filter_fp_chance = 0.01
    AND caching = {'keys': 'ALL', 'rows_per_partition': 'NONE'}
    AND cdc = false
    AND comment = ''
    AND compaction = {'class': 'org.apache.cassandra.db.compaction.SizeTieredCompactionStrategy', 'max_threshold': '32', 'min_threshold': '4'}
    AND compression = {'chunk_length_in_kb': '16', 'class': 'org.apache.cassandra.io.compress.LZ4Compressor'}
    AND crc_check_chance = 1.0
    AND default_time_to_live = 0
    AND extensions = {}
    AND gc_grace_seconds = 864000
    AND max_index_interval = 2048
    AND memtable_flush_period_in_ms = 0
    AND min_index_interval = 128
    AND read_repair = 'BLOCKING'
    AND speculative_retry = '99p';

CREATE CUSTOM INDEX business_profiles_by_full_name_idx ON dispatch_users.business_profiles (full_name) USING 'org.apache.cassandra.index.sasi.SASIIndex' WITH OPTIONS = {'analyzer_class': 'org.apache.cassandra.index.sasi.analyzer.NonTokenizingAnalyzer', 'case_sensitive': 'false', 'mode': 'CONTAINS'};


CREATE TABLE dispatch_users.applications_templates (
    id uuid PRIMARY KEY,
    accident_history_disclaimer text,
    accident_history_include boolean,
    accident_history_lookback float,
    address_history_allow_gaps boolean,
    address_history_disclaimer text,
    address_history_lookback float,
    application_disclaimer text,
    author text,
    author_id uuid,
    business_id uuid,
    demographics_disclaimer text,
    description text,
    driving_history_include boolean,
    education_history_include boolean,
    employment text,
    employment_history_allow_gaps boolean,
    employment_history_disclaimer text,
    employment_history_lookback float,
    equipment_experience_include boolean,
    license_history_disclaimer text,
    license_history_lookback float,
    name text,
    visibility text,
    demographics_fields map<text, text>,
    equipment_types set<text>
) WITH additional_write_policy = '99p'
    AND bloom_filter_fp_chance = 0.01
    AND caching = {'keys': 'ALL', 'rows_per_partition': 'NONE'}
    AND cdc = false
    AND comment = ''
    AND compaction = {'class': 'org.apache.cassandra.db.compaction.SizeTieredCompactionStrategy', 'max_threshold': '32', 'min_threshold': '4'}
    AND compression = {'chunk_length_in_kb': '16', 'class': 'org.apache.cassandra.io.compress.LZ4Compressor'}
    AND crc_check_chance = 1.0
    AND default_time_to_live = 0
    AND extensions = {}
    AND gc_grace_seconds = 864000
    AND max_index_interval = 2048
    AND memtable_flush_period_in_ms = 0
    AND min_index_interval = 128
    AND read_repair = 'BLOCKING'
    AND speculative_retry = '99p';

CREATE INDEX applications_templates_visibility ON dispatch_users.applications_templates (visibility);


CREATE TABLE dispatch_users.businesses (
    name text PRIMARY KEY,
    about text,
    description text,
    display_name text,
    dot_number text,
    dot_verified text,
    id uuid,
    industry text,
    industry_category text,
    legal_structure text,
    mc_number text,
    owner uuid,
    addresses map<int, text>,
    images map<int, text>
) WITH additional_write_policy = '99p'
    AND bloom_filter_fp_chance = 0.01
    AND caching = {'keys': 'ALL', 'rows_per_partition': 'NONE'}
    AND cdc = false
    AND comment = ''
    AND compaction = {'class': 'org.apache.cassandra.db.compaction.SizeTieredCompactionStrategy', 'max_threshold': '32', 'min_threshold': '4'}
    AND compression = {'chunk_length_in_kb': '16', 'class': 'org.apache.cassandra.io.compress.LZ4Compressor'}
    AND crc_check_chance = 1.0
    AND default_time_to_live = 0
    AND extensions = {}
    AND gc_grace_seconds = 864000
    AND max_index_interval = 2048
    AND memtable_flush_period_in_ms = 0
    AND min_index_interval = 128
    AND read_repair = 'BLOCKING'
    AND speculative_retry = '99p';

CREATE INDEX businesses_by_id ON dispatch_users.businesses (id);


CREATE TABLE dispatch_users.documents (
    id uuid PRIMARY KEY,
    contents blob,
    created_at timestamp,
    profile_id uuid,
    public_key blob,
    signature blob,
    template_name text
) WITH additional_write_policy = '99p'
    AND bloom_filter_fp_chance = 0.01
    AND caching = {'keys': 'ALL', 'rows_per_partition': 'NONE'}
    AND cdc = false
    AND comment = ''
    AND compaction = {'class': 'org.apache.cassandra.db.compaction.SizeTieredCompactionStrategy', 'max_threshold': '32', 'min_threshold': '4'}
    AND compression = {'chunk_length_in_kb': '16', 'class': 'org.apache.cassandra.io.compress.LZ4Compressor'}
    AND crc_check_chance = 1.0
    AND default_time_to_live = 0
    AND extensions = {}
    AND gc_grace_seconds = 864000
    AND max_index_interval = 2048
    AND memtable_flush_period_in_ms = 0
    AND min_index_interval = 128
    AND read_repair = 'BLOCKING'
    AND speculative_retry = '99p';

CREATE INDEX documents_profile_id_idx ON dispatch_users.documents (profile_id);

CREATE INDEX documents_template_name_idx ON dispatch_users.documents (template_name);


CREATE TABLE dispatch_users.profiles (
    id uuid PRIMARY KEY,
    default_business text,
    first_name text,
    full_name text,
    gender text,
    last_name text,
    middle_name text,
    privacy_status text,
    profile_picture text,
    seeking_status text,
    suffix text,
    user_id uuid,
    username text,
    addresses map<int, text>,
    businesses map<text, text>,
    images map<int, text>,
    work_history map<int, text>
) WITH additional_write_policy = '99p'
    AND bloom_filter_fp_chance = 0.01
    AND caching = {'keys': 'ALL', 'rows_per_partition': 'NONE'}
    AND cdc = false
    AND comment = ''
    AND compaction = {'class': 'org.apache.cassandra.db.compaction.SizeTieredCompactionStrategy', 'max_threshold': '32', 'min_threshold': '4'}
    AND compression = {'chunk_length_in_kb': '16', 'class': 'org.apache.cassandra.io.compress.LZ4Compressor'}
    AND crc_check_chance = 1.0
    AND default_time_to_live = 0
    AND extensions = {}
    AND gc_grace_seconds = 864000
    AND max_index_interval = 2048
    AND memtable_flush_period_in_ms = 0
    AND min_index_interval = 128
    AND read_repair = 'BLOCKING'
    AND speculative_retry = '99p';

CREATE CUSTOM INDEX profiles_by_full_name_idx ON dispatch_users.profiles (full_name) USING 'org.apache.cassandra.index.sasi.SASIIndex' WITH OPTIONS = {'analyzer_class': 'org.apache.cassandra.index.sasi.analyzer.NonTokenizingAnalyzer', 'case_sensitive': 'false', 'mode': 'CONTAINS'};

CREATE INDEX profiles_username_idx ON dispatch_users.profiles (username);


CREATE TABLE dispatch_users.unassociated_profiles (
    email text PRIMARY KEY,
    business_name text,
    profile_id uuid
) WITH additional_write_policy = '99p'
    AND bloom_filter_fp_chance = 0.01
    AND caching = {'keys': 'ALL', 'rows_per_partition': 'NONE'}
    AND cdc = false
    AND comment = ''
    AND compaction = {'class': 'org.apache.cassandra.db.compaction.SizeTieredCompactionStrategy', 'max_threshold': '32', 'min_threshold': '4'}
    AND compression = {'chunk_length_in_kb': '16', 'class': 'org.apache.cassandra.io.compress.LZ4Compressor'}
    AND crc_check_chance = 1.0
    AND default_time_to_live = 0
    AND extensions = {}
    AND gc_grace_seconds = 864000
    AND max_index_interval = 2048
    AND memtable_flush_period_in_ms = 0
    AND min_index_interval = 128
    AND read_repair = 'BLOCKING'
    AND speculative_retry = '99p';


CREATE TABLE dispatch_users.users (
    username text PRIMARY KEY,
    a1 text,
    a2 text,
    first_name text,
    last_name text,
    pwd text,
    q1 text,
    q2 text,
    secret text,
    status int,
    terms_accepted_at timestamp,
    uid uuid,
    emails map<text, text>,
    phone_numbers map<text, text>,
    trusted_devices list<text>
) WITH additional_write_policy = '99p'
    AND bloom_filter_fp_chance = 0.01
    AND caching = {'keys': 'ALL', 'rows_per_partition': 'NONE'}
    AND cdc = false
    AND comment = ''
    AND compaction = {'class': 'org.apache.cassandra.db.compaction.SizeTieredCompactionStrategy', 'max_threshold': '32', 'min_threshold': '4'}
    AND compression = {'chunk_length_in_kb': '16', 'class': 'org.apache.cassandra.io.compress.LZ4Compressor'}
    AND crc_check_chance = 1.0
    AND default_time_to_live = 0
    AND extensions = {}
    AND gc_grace_seconds = 864000
    AND max_index_interval = 2048
    AND memtable_flush_period_in_ms = 0
    AND min_index_interval = 128
    AND read_repair = 'BLOCKING'
    AND speculative_retry = '99p';


CREATE TABLE dispatch_users.verified_addresses (
    address text,
    username text,
    verified_at timestamp,
    PRIMARY KEY (address, username)
) WITH CLUSTERING ORDER BY (username ASC)
    AND additional_write_policy = '99p'
    AND bloom_filter_fp_chance = 0.01
    AND caching = {'keys': 'ALL', 'rows_per_partition': 'NONE'}
    AND cdc = false
    AND comment = ''
    AND compaction = {'class': 'org.apache.cassandra.db.compaction.SizeTieredCompactionStrategy', 'max_threshold': '32', 'min_threshold': '4'}
    AND compression = {'chunk_length_in_kb': '16', 'class': 'org.apache.cassandra.io.compress.LZ4Compressor'}
    AND crc_check_chance = 1.0
    AND default_time_to_live = 0
    AND extensions = {}
    AND gc_grace_seconds = 864000
    AND max_index_interval = 2048
    AND memtable_flush_period_in_ms = 0
    AND min_index_interval = 128
    AND read_repair = 'BLOCKING'
    AND speculative_retry = '99p';



CREATE TABLE dispatch_users.otp_validations (
    username text,
    address text,
    created_at timestamp,
    otp text,
    type int,
    verified boolean,
    PRIMARY KEY (username, address)
) WITH CLUSTERING ORDER BY (address ASC)
    AND additional_write_policy = '99p'
    AND bloom_filter_fp_chance = 0.01
    AND caching = {'keys': 'ALL', 'rows_per_partition': 'NONE'}
    AND cdc = false
    AND comment = ''
    AND compaction = {'class': 'org.apache.cassandra.db.compaction.SizeTieredCompactionStrategy', 'max_threshold': '32', 'min_threshold': '4'}
    AND compression = {'chunk_length_in_kb': '16', 'class': 'org.apache.cassandra.io.compress.LZ4Compressor'}
    AND crc_check_chance = 1.0
    AND default_time_to_live = 0
    AND extensions = {}
    AND gc_grace_seconds = 864000
    AND max_index_interval = 2048
    AND memtable_flush_period_in_ms = 0
    AND min_index_interval = 128
    AND read_repair = 'BLOCKING'
    AND speculative_retry = '99p';
