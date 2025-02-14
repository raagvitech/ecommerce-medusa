import { Migration } from '@mikro-orm/migrations';

export class Migration20241110190231 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table if not exists "variant_images_settings" ("product_id" text not null, "base_option_enabled" boolean not null default false, "base_option_id" text null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "variant_images_plugin_settings_pkey" primary key ("product_id"));'
    );
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "variant_images_settings" cascade;');
  }
}
