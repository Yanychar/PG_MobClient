@echo off


set jdk_home="C:\Program Files\Java\jdk1.7.0_67"

set source="D:\Development\Inventory Development\PG_MobClient\langpacks"
set dest="D:\Development\Inventory Development\PG_MobClient\www\js\i18n"


del %dest%\resource_FI.js
del %dest%\resource_RU.js


"%java_home%"\bin\native2ascii -encoding utf8 %source%\resource_FI.txt %dest%\resource_FI.js
"%java_home%"\bin\native2ascii -encoding utf8 %source%\resource_RU.txt %dest%\resource_RU.js


pause
