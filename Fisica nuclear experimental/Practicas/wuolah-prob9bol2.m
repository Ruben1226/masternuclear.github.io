% Problema 9. Boletín II. FNE

clear; clc; close all;

%% 1. DEFINICIÓN DE PARÁMETROS FÍSICOS
Z1 = 16; Z2 = 16;      % Azufre-32
A1 = 32; A2 = 32;
e2 = 1.4399644;        % e^2/(4*pi*epsilon_0) en MeV*fm
conv_fm2_to_mb = 10;   % 1 fm^2 = 10 mb

% Lista de archivos y sus energías de haz (Lab)
% Definir la ruta relativa o absoluta de la carpeta
data_folder = 'datos secciones eficaces\datos secciones eficaces\32S+32S';
files = {'exp32s32se70.dat;4', 'exp32s32se75.dat;3', 'exp32s32se90.dat;7', ...
         'exp32s32se97.dat;3', 'exp32s32se120.dat;3', 'exp32s32se160.dat;3'};
E_lab = [70, 75, 90, 97, 120, 160]; % MeV

% Contenedores para almacenar datos combinados (para el ajuste global)
all_d_red = [];
all_ratio = [];
all_d_ratio = [];

%% 2. PROCESAMIENTO DE DATOS Y CÁLCULOS (Apartados a y b)

figure(1); set(gcf, 'Name', 'Apartado A: Ratio vs Angulo', 'Position', [100, 100, 1200, 500]);
subplot(1,2,1); hold on; grid on; box on;
title('Escala Lineal'); xlabel('\theta_{CM} (deg)'); ylabel('\sigma / \sigma_{Ruth}');

subplot(1,2,2); hold on; grid on; box on;
title('Escala Logarítmica'); xlabel('\theta_{CM} (deg)'); ylabel('\sigma / \sigma_{Ruth}'); 
set(gca, 'YScale', 'log');

figure(2); set(gcf, 'Name', 'Apartado B: Ratio vs Distancia Reducida', 'Position', [150, 150, 800, 600]);
hold on; grid on; box on;
title('Ratio Rutherford vs Distancia Reducida');
xlabel('d_{red} (fm)'); ylabel('\sigma / \sigma_{Ruth}');
set(gca, 'YScale', 'log');

colors = lines(length(files)); % Colores distintos para cada energía

for i = 1:length(files)

    % fullfile une la carpeta y el nombre del archivo automáticamente
    filename = fullfile(data_folder, files{i});
    E_cm = E_lab(i) / 2; % Energía en centro de masas (masas iguales)
    
    % --- Carga robusta de datos ---
    raw = read_nuclear_dat(filename);
    if isempty(raw)
        warning('No se pudo leer %s. Saltando...', filename);
        continue;
    end

    theta = raw(:,1);      % Grados
    sigma_exp = raw(:,2);  % mb/sr
    d_sigma = raw(:,3);    % Error
    
    % --- Corrección específica para el archivo de 90 MeV ---
    % Si el nombre contiene '90', asumimos error porcentual en columna 3
    if contains(filename, '90')
        d_sigma = sigma_exp .* (d_sigma / 100);
    end
    
    % --- Cálculo de Rutherford (Puntual) ---
    % Convertimos theta a radianes para cálculo
    theta_rad = deg2rad(theta);
    sin4_theta2 = (sin(theta_rad./2)).^4;
    
    % Factor Rutherford en mb/sr
    % R = (Z1*Z2*e^2 / 4E)^2 * (1/sin^4) * conversiones
    factor_R = ((Z1 * Z2 * e2) / (4 * E_cm))^2 * conv_fm2_to_mb;
    sigma_ruth = factor_R ./ sin4_theta2;
    
    % Ratio
    ratio = sigma_exp ./ sigma_ruth;
    d_ratio = d_sigma ./ sigma_ruth; % Error propagado
    
    % --- Cálculo de Distancia de Máxima Aproximación (D) ---
    % D = (Z1 Z2 e^2 / 2 E_cm) * (1 + 1/sin(theta/2))
    factor_D = (Z1 * Z2 * e2) / (2 * E_cm);
    D = factor_D .* (1 + 1./sin(theta_rad./2));
    
    % Distancia reducida
    denom_A = A1^(1/3) + A2^(1/3);
    d_red = D / denom_A;

    % --- Graficar con Barras de Error ---
    displayName = sprintf('%d MeV', E_lab(i));
    
    % Graficar (Apartado a)
    figure(1);
    subplot(1,2,1); 
    errorbar(theta, ratio, d_ratio, '.', 'Color', colors(i,:), ...
        'MarkerSize', 10, 'CapSize', 0, 'DisplayName', displayName);
    subplot(1,2,2); 
    errorbar(theta, ratio, d_ratio, '.', 'Color', colors(i,:), ...
        'MarkerSize', 10, 'CapSize', 0, 'DisplayName', displayName);
    
    % Graficar (Apartado b)
    figure(2);
    errorbar(d_red, ratio, d_ratio, '.', 'Color', colors(i,:), ...
        'MarkerSize', 10, 'CapSize', 0, 'DisplayName', displayName);
    
    % Acumular datos para el ajuste (solo la zona de caída)
    % Filtramos outliers, ceros, NaNs o Infs (si los hubiera) para evitar problemas con log
    valid = ratio > 0 & ~isnan(ratio);
    all_d_red = [all_d_red; d_red(valid)];
    all_ratio = [all_ratio; ratio(valid)];
    all_d_ratio = [all_d_ratio; d_ratio(valid)];
end

figure(1); subplot(1,2,1); legend('Location','best'); xlim([15 95]); subplot(1,2,2); legend('Location','best'); xlim([15 95]);
figure(2); legend('Location','best');

%% 3. AJUSTE EXPONENCIAL PONDERADO (Weighted Least Squares)

% Ordenamos los datos combinados por distancia reducida
[all_d_red, sort_idx] = sort(all_d_red);
all_ratio = all_ratio(sort_idx);
all_d_ratio = all_d_ratio(sort_idx);

% DEFINIR LA ZONA DE CAÍDA
% Visualmente (viendo la gráfica 2), la caída exponencial ocurre cuando
% la interacción nuclear "enciende", haciendo caer el ratio por debajo de 1.

fprintf('\n--- RESULTADOS: AJUSTE PONDERADO (Apartados c, d, e) ---\n');
fprintf('Modelo: y = a * exp(b * d_red)\n');
fprintf('d_red0 = -ln(a)/b (Punto donde Ratio = 1 extrapolado)\n\n');

% Definimos 3 intervalos de distancias reducidas donde parece haber caída
% Nota: Estos valores se eligen inspeccionando la Fig 2 generada.
% Típicamente la caída está entre 1.4 fm y 1.7 fm para estos sistemas.
intervals = [
    1.00, 1.35;  % Intervalo 1 (Zona más baja)
    1.35, 1.55;  % Intervalo 2 (Zona media)
    1.55, 1.70   % Intervalo 3 (Zona más alta)
];

d_red0_rec = zeros(1,3);
colorsFit = lines(length(intervals)); % Colores distintos para cada intervalo
figure(2); 
for k = 1:size(intervals, 1)
    min_d = intervals(k,1);
    max_d = intervals(k,2);
    
    % Filtrar datos en el intervalo
    idx = (all_d_red >= min_d) & (all_d_red <= max_d) & (all_ratio > 0);
    x = all_d_red(idx);
    y = log(all_ratio(idx)); % Linealización

    if isempty(x)
        fprintf('Intervalo %d vacío.\n', k);
        continue;
    end
    
    % --- MATRIZ DE PESOS (El toque de rigor) ---
    % Error en ln(y) es dy/y. El peso es el inverso de la varianza: w = 1/sigma^2
    % Si tienes all_d_ratio (errores):
    sigma_log = all_d_ratio(idx) ./ all_ratio(idx);
    w = 1 ./ (sigma_log.^2);
    
    % Si NO tienes all_d_ratio cargado, usamos pesos iguales (w=1):
    % w = ones(size(x)); 
    
    % --- RESOLUCIÓN MATRICIAL MÍNIMOS CUADRADOS ---
    % Sistema: Y = X * Beta
    % X tiene columna de 1s (ordenada) y columna de datos (pendiente)
    X_mat = [ones(length(x), 1), x]; 
    W = diag(w); % Matriz diagonal de pesos
    
    % Solución analítica: Beta = (X'WX)^-1 * X'Wy
    % En MATLAB operador \ es más eficiente y estable numéricamente
    Beta = (X_mat' * W * X_mat) \ (X_mat' * W * y);
    
    ln_a = Beta(1);
    b = Beta(2);
    a = exp(ln_a);
    
    % Cálculo del radio de interacción fuerte
    d_red0 = -ln_a / b;
    d_red0_rec(k) = d_red0;
    
    % Cálculo de errores en los parámetros (Matriz de covarianza)
    % Cov = (X'WX)^-1
    Cov = inv(X_mat' * W * X_mat); 
    err_b = sqrt(Cov(2,2));
    err_ln_a = sqrt(Cov(1,1));
    % Propagación de error a d_red0 (opcional pero recomendado)
    % d0 = -u/v -> error relativo cuadrático sumado
    u = ln_a; 
    v = b;
    
    df_du = -1 / v;
    df_dv = u / v^2;
    
    var_u = Cov(1,1);       % Varianza de ln(a)
    a_err = a*sqrt(var_u);
    var_v = Cov(2,2);       % Varianza de b
    cov_uv = Cov(1,2);      % Covarianza (término cruzado crucial)
    
    % Fórmula general de propagación con correlación:
    sigma2_f = (df_du^2 * var_u) + (df_dv^2 * var_v) + (2 * df_du * df_dv * cov_uv);
    err_d_red0 = sqrt(sigma2_f);
    
    % Graficar
    displayNameFit = sprintf('Fit %d', k);
    x_line = linspace(min_d-0.1, max_d+0.1, 100);
    y_line = a * exp(b * x_line);
    plot(x_line, y_line, '-', 'LineWidth', 1, 'Color', colorsFit(k,:), 'DisplayName', displayNameFit);
    text(x_line(end), y_line(end), sprintf('Fit %d', k));
    
    % --- RESULTADOS ---
    fprintf('Intervalo %d [%.2f-%.2f fm]:\n', k, min_d, max_d);
    fprintf('  d_red0 = %.4f +/- %.4f fm\n', d_red0, err_d_red0);
    fprintf('  (Parámetros: a = %.3e +/- %.3e, b = %.2f +/- %.2f)\n\n', a, a_err, b, sqrt(var_v));
end

desv = std(d_red0_rec);
media = mean(d_red0_rec);
fprintf('Desviación estándar de d_red0 = %.4f \n', desv);
fprintf('Media de d_red0 = %.4f \n', media);
fprintf('Error relativo de d_red0 = %.4f \n', desv/media*100);

%% FUNCIÓN LOCAL DE LECTURA DE ARCHIVOS
function data = read_nuclear_dat(filename)
    % Lee archivos saltando encabezados irregulares
    fid = fopen(filename, 'r');
    if fid == -1, error(['No se encuentra: ' filename]); end
    
    % Leer todo el contenido línea a línea
    raw_lines = textscan(fid, '%s', 'Delimiter', '\n');
    fclose(fid);
    lines = raw_lines{1};
    
    data_list = [];
    
    for k = 1:length(lines)
        line = strtrim(lines{k});
        % Ignorar líneas vacías o encabezados cortos (menos de 10 caracteres)
        if isempty(line) || length(line) < 5
            continue;
        end
        
        % Intentar leer números
        vals = str2num(line); %#ok<ST2NM>
        
        % Heurística: Si hay 3 o más números, es dato. 
        % Si empieza con letra (como 'T' en se90), str2num falla o da vacío.
        if length(vals) >= 3
            data_list = [data_list; vals(1:3)];
        elseif length(vals) == 2
            % A veces el error salta de línea, caso raro, ignoramos por simplicidad
            continue;
        end
    end
    data = data_list;
end
