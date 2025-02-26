<?php

namespace RestServer\Utils;

/**
 * This is the class for building up the emailing client.
 */
class EmailClient
{
    /**
     * The email address where the message will be sent to.
     * 
     * @var string RECEIVER_EMAIL
     */
    private string $receiverEmail;

    /**
     * The name of the message's author.
     * 
     * @var string $senderName
     */
    private string $senderName;

    /**
     * The email address where the message will be sent from.
     * 
     * @var string $senderEmail
     */
    private string $senderEmail;

    /**
     * The email's subject text.
     *
     * @var string $subject
     */
    private string $subject;

    /**
     * The email's content.
     * 
     * @var string $message
     */
    private string $message;

    public function setReceiverEmail($email): void
    {
        $this->receiverEmail = $email;
    }

    /**
     * Set the name of the message's author.
     * 
     * @param string $name The name of the message's author.
     */
    public function setSenderName($name): void
    {
        $this->senderName = $name;
    }

    /**
     * Set the email address of the message's author.
     * 
     * @param string $email The email address of the message's author.
     */
    public function setSenderEmail($email): void
    {
        $this->senderEmail = $email;
    }

    /**
     * Set the message's subject text.
     * 
     * @param string $subject The message's subject text.
     */
    public function setSubject($subject): void
    {
        $this->subject = $subject;
    }

    /**
     * Set the message's content.
     * 
     * @param string $message The message itself.
     */
    public function setMessage($message): void
    {
        $this->message = $message;
    }

    /**
     * Sends the email itself.
     * 
     * @return bool Return whether the email was sent successfully or not.
     */
    public function send(): bool
    {
        $headers = [
            "From" => "$this->senderName <$this->senderEmail>",
            "Content-Type" => "text/html; charset=utf-8",
            "X-Mailer" => "PHP/" . phpversion(),
        ];

        if (!($this->senderName && $this->senderEmail && $this->subject && $this->message)) {
            return false;
        }

        return mail(
            $this->receiverEmail,
            $this->subject,
            $this->message,
            $headers
        );
    }
}