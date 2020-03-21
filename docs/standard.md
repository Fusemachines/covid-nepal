
## Database Naming Convention
* camelCase
* append DB on the end of name
* make singular (collections are plural)
* MongoDB states a nice example:
    * To select a database to use, in the mongo shell, issue the use <db> statement, as in the following example:

use myDB
use myNewDB

Content from: https://docs.mongodb.com/manual/core/databases-and-collections/#databases

COLLECTIONS

Lowercase names: avoids case sensitivity issues, MongoDB collection names are case sensitive.

Plural: more obvious to label a collection of something as the plural, e.g. "files" rather than "file"

>No word separators: Avoids issues where different people (incorrectly) separate words (username <-> user_name, first_name <->
firstname). This one is up for debate according to a few people
around here but provided the argument is isolated to collection names I don't think it should be ;) If you find yourself improving the
readability of your collection name by adding underscores or
camelCasing your collection name is probably too long or should use
periods as appropriate which is the standard for collection
categorization.

Dot notation for higher detail collections: Gives some indication to how collections are related. For example you can be reasonably sure you could delete "users.pagevisits" if you deleted "users", provided the people that designed the schema did a good job.

Content from: http://www.tutespace.com/2016/03/schema-design-and-naming-conventions-in.html