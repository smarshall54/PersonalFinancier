% script that predicts your tax burden based on your contributions to
% tax-deferred savings vehicles

% US tax brackets
%
% 10%  - 9225
% 15% - 37450
% 25% - 90750
% 28% - 189300
% 33% - 411500
% 35% - 413200
% 39.6% - inf
%
% US Contribution Limits (2015)
%
% 401k - 18000
% Trad IRA - 5500
% Roth IRA - 5500
% HSA - 3300
%
% US FICA taxes
%
% SS tax:
% 6.2% of eligible pay
% on a maximum of 118500 income per year
% Medicare tax:
% 1.45% on all eligible income (no max)
% add'l 0.9% if income >
%           MFJ - 250k
%           MFS - 125k
%           Sing - 200k
%           HOH/QW - 200k
%
% previous data for SS tax maximums:
%[2015 118500; 2014 117000; 2013 113700; 2012 110100; 2011 106800; 2009 106800; 2008 102000]


tb = [9225,0.01;37450,0.15;90750,.25;189300,.28;411500,.33;413200,.25;inf,.396];

salary = 90000;
401k_contrib = 18000;
401k_match = 0.05
HSAcontrib = 3300;
IRAcontrib = 5500;
IRAtype = 'roth'; % alternative = 'trad'

rem = salary;
grosspay = salary
while rem>0
    rem = salary;
end