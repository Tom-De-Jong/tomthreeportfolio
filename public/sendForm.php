<?php
session_start();

header('Content-Type: text/html; charset=UTF-8');

$TO_EMAIL = 'tomdejong2009@gmail.com';
$RATE_LIMIT = 3;
$RATE_WINDOW = 3600;

$status = null;
$message = '';

function sanitize(string $input): string {
    return htmlspecialchars(strip_tags(trim($input)), ENT_QUOTES, 'UTF-8');
}

function checkRateLimit(int $limit, int $window): bool {
    if (!isset($_SESSION['form_submissions'])) {
        $_SESSION['form_submissions'] = [];
    }

    $now = time();
    $_SESSION['form_submissions'] = array_filter(
        $_SESSION['form_submissions'],
        fn($timestamp) => ($now - $timestamp) < $window
    );

    if (count($_SESSION['form_submissions']) >= $limit) {
        return false;
    }

    $_SESSION['form_submissions'][] = $now;
    return true;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $naam    = sanitize($_POST['naam'] ?? '');
    $email   = sanitize($_POST['email'] ?? '');
    $bericht = sanitize($_POST['bericht'] ?? '');

    if (empty($naam) || empty($email) || empty($bericht)) {
        $status  = 'error';
        $message = 'Vul alle verplichte velden in.';
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $status  = 'error';
        $message = 'Vul een geldig e-mailadres in.';
    } elseif (!checkRateLimit($RATE_LIMIT, $RATE_WINDOW)) {
        $status  = 'error';
        $message = 'Je hebt te veel berichten verzonden. Probeer het later opnieuw.';
    } else {
        $subject = "Nieuw contactbericht van {$naam}";
        $body    = "Naam: {$naam}\nE-Mail: {$email}\n\nBericht:\n{$bericht}";
        $headers = implode("\r\n", [
            "From: noreply@tomwebsites.nl",
            "Reply-To: {$email}",
            "X-Mailer: PHP/" . phpversion(),
            "Content-Type: text/plain; charset=UTF-8",
        ]);

        if (mail($TO_EMAIL, $subject, $body, $headers)) {
            $status  = 'success';
            $message = 'Bericht is verzonden.';
        } else {
            $status  = 'error';
            $message = 'Er is een fout opgetreden. Probeer het later opnieuw.';
        }
    }
}
?>
<!DOCTYPE html>
<html lang="nl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Contact – TomWebsites</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=DM+Mono:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="form.css">
</head>
<body>

<div class="formPage">

    <?php if ($status === 'success'): ?>

        <div class="feedback success">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <polyline points="20 6 9 17 4 12"/>
            </svg>
            <p class="feedbackTitle">Bericht is verzonden.</p>
            <p class="feedbackSub">Ik neem zo snel mogelijk contact met je op.</p>
            <a href="/" class="backLink">← Terug naar home</a>
        </div>

    <?php else: ?>

        <?php if ($status === 'error'): ?>
            <div class="feedback error">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
                <p class="feedbackTitle">Er is een fout opgetreden.</p>
                <p class="feedbackSub"><?= $message ?></p>
            </div>
        <?php endif; ?>

        <form class="form" action="sendForm.php" method="POST" novalidate>
            <div class="splitForm">
                <div class="splitFormItem">
                    <label for="naam">Naam*</label>
                    <input
                        type="text"
                        id="naam"
                        name="naam"
                        autocomplete="name"
                        value="<?= htmlspecialchars($_POST['naam'] ?? '', ENT_QUOTES, 'UTF-8') ?>"
                        required
                    >
                </div>
                <div class="splitFormItem">
                    <label for="email">E-Mail*</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        autocomplete="email"
                        value="<?= htmlspecialchars($_POST['email'] ?? '', ENT_QUOTES, 'UTF-8') ?>"
                        required
                    >
                </div>
            </div>

            <label for="bericht">Bericht*</label>
            <textarea id="bericht" name="bericht" required><?= htmlspecialchars($_POST['bericht'] ?? '', ENT_QUOTES, 'UTF-8') ?></textarea>

            <button class="submitButton" type="submit">Verstuur</button>
        </form>

    <?php endif; ?>

</div>

</body>
</html>