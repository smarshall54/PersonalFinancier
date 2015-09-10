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

tb = [9225,0.01;37450,0.15;90750,.25;189300,.28;411500,.33;413200,.25;inf,.396];

salary = 90000;

while rem>0
    salary