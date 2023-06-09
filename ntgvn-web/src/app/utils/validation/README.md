Search library
email
/
^((?!\.)[\w-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$
/
gm
open regex in editor
RegEx email

/^((?!\.)[\w-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/gim;

Just playing with Reg Ex. This to validate emails in following ways



The email couldn't start or finish with a dot

The email shouldn't contain spaces into the string

The email shouldn't contain special chars (<:, *,ecc)

The email could contain dots in the middle of mail address before the @

The email could contain a double doman ( '.de.org' or similar rarity)


Groups

There was created 3 groups into this validations that could be used for custom purposes or replacements



mailname@domain.com




First group takes the first string with the name of email $1 => (mailname)

Second group takes the @ plus the domain: $2 => (@domain)

Third group takes the last part after the domain : $3 => (.com)

submitted by https://www.linkedin.com/in/peralta-steve-atileon/ - 4 years ago
