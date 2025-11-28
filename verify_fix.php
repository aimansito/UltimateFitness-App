<?php

$corrupt_gomez = "G\xc3\x83\xc2\xb3mez"; // GÃ³mez
$corrupt_perez = "P\xc3\x83\xc2\xa9rez"; // PÃ©rez

echo "Original (Corrupt): $corrupt_gomez\n";
$fixed_gomez = utf8_decode($corrupt_gomez); // This might be deprecated in PHP 8.2, using mb_convert_encoding instead if needed
// Actually utf8_decode converts UTF-8 to ISO-8859-1.
// If the string is "UTF-8 bytes interpreted as Latin-1 then encoded to UTF-8", 
// then decoding it as UTF-8 (to Latin-1) should give us the "original bytes" which ARE the UTF-8 bytes of the real char.

// Let's try:
// Real 'ó' is C3 B3.
// Corrupt 'ó' is C3 83 C2 B3.
// C3 83 is UTF-8 for 'Ã' (C3 in Latin-1).
// C2 B3 is UTF-8 for '³' (B3 in Latin-1).
// So if we take C3 83 C2 B3 and decode it as UTF-8 -> we get bytes C3 B3.
// C3 B3 is valid UTF-8 for 'ó'.

// So yes, converting FROM UTF-8 TO ISO-8859-1 (binary) should recover the UTF-8 string.

$fixed_gomez = mb_convert_encoding($corrupt_gomez, 'ISO-8859-1', 'UTF-8');
echo "Fixed: $fixed_gomez\n";

$fixed_perez = mb_convert_encoding($corrupt_perez, 'ISO-8859-1', 'UTF-8');
echo "Fixed: $fixed_perez\n";
